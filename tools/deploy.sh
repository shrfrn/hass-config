#!/bin/bash

PI_HOST="root@homeassistant.local"
PI_SCRIPT="/root/deploy.sh"

# Colors
WHITE='\033[1;37m'
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
DIM='\033[2m'
NC='\033[0m'

# Spinner characters
SPINNER='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

BRANCH=$(git branch --show-current)

# Check we're not on main
if [ "$BRANCH" = "main" ]; then
    echo -e "${RED}Error: Switch to a feature branch first.${NC}"
    exit 1
fi

# Check for unpushed commits
UNPUSHED=$(git log origin/$BRANCH..$BRANCH --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -eq 0 ]; then
    echo -e "${YELLOW}No new commits to deploy on $BRANCH${NC}"
    echo -e "${DIM}Make changes and commit before deploying.${NC}"
    exit 0
fi

echo ""
echo -e "${WHITE}📤 Pushing $BRANCH to origin...${NC}"
git push origin "$BRANCH" 2>&1 | sed "s/^/   /"

echo ""
echo -e "${CYAN}🍓 Deploying to Pi...${NC}"
echo ""

# Create pipes for communication
PIPE=$(mktemp -u)
mkfifo "$PIPE"

# Start SSH and write to pipe
ssh "$PI_HOST" "$PI_SCRIPT $BRANCH" 2>&1 > "$PIPE" &
SSH_PID=$!

# Track state
CURRENT_STAGE=""
STAGE_START=0
SPIN_IDX=0
OUTPUT_LINES=()
EXIT_CODE=0
TOTAL_START=$SECONDS

# Read from pipe with timeout to allow spinner updates
while true; do
    # Try to read a line (with timeout)
    if read -t 0.1 line < "$PIPE" 2>/dev/null; then
        case "$line" in
            "[STAGE:CHECK]")
                CURRENT_STAGE="check"
                STAGE_START=$SECONDS
                ;;
            "[STAGE:CHECK_PASS]")
                ELAPSED=$((SECONDS - STAGE_START))
                printf "\r   ${GREEN}✓${NC} Config check passed ${DIM}(${ELAPSED}s)${NC}          \n"
                CURRENT_STAGE=""
                ;;
            "[STAGE:CHECK_FAIL]")
                ELAPSED=$((SECONDS - STAGE_START))
                printf "\r   ${RED}✗${NC} Config check failed ${DIM}(${ELAPSED}s)${NC}          \n"
                CURRENT_STAGE=""
                ;;
            "[STAGE:RESTART]")
                CURRENT_STAGE="restart"
                STAGE_START=$SECONDS
                ;;
            "[STAGE:RESTART_DONE]")
                ELAPSED=$((SECONDS - STAGE_START))
                printf "\r   ${GREEN}✓${NC} Home Assistant restarted ${DIM}(${ELAPSED}s)${NC}          \n"
                CURRENT_STAGE=""
                ;;
            "[EXIT:"*)
                EXIT_CODE="${line#[EXIT:}"
                EXIT_CODE="${EXIT_CODE%]}"
                break
                ;;
            *)
                OUTPUT_LINES+=("$line")
                ;;
        esac
    fi
    
    # Update spinner if in a stage
    if [ -n "$CURRENT_STAGE" ]; then
        ELAPSED=$((SECONDS - STAGE_START))
        SPIN_CHAR="${SPINNER:SPIN_IDX++%10:1}"
        
        case "$CURRENT_STAGE" in
            "check")
                printf "\r   ${YELLOW}${SPIN_CHAR}${NC} Config check running... ${DIM}${ELAPSED}s${NC}  "
                ;;
            "restart")
                printf "\r   ${YELLOW}${SPIN_CHAR}${NC} Restarting Home Assistant... ${DIM}${ELAPSED}s${NC}  "
                ;;
        esac
    fi
    
    # Check if SSH is still running
    if ! kill -0 $SSH_PID 2>/dev/null; then
        # Drain any remaining output
        while read -t 0.1 line < "$PIPE" 2>/dev/null; do
            case "$line" in
                "[STAGE:"*) ;;
                *) OUTPUT_LINES+=("$line") ;;
            esac
        done
        break
    fi
done

# Cleanup
rm -f "$PIPE"
wait $SSH_PID 2>/dev/null
EXIT_CODE=$?

TOTAL_TIME=$((SECONDS - TOTAL_START))

# Show Pi output
echo ""
echo -e "${DIM}── Pi log ──${NC}"
for line in "${OUTPUT_LINES[@]}"; do
    echo -e "   ${DIM}│${NC} $line"
done
echo -e "${DIM}────────────${NC}"

if [ "$EXIT_CODE" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy succeeded!${NC} ${DIM}(${TOTAL_TIME}s total)${NC}"
    
    echo -e "${WHITE}📥 Updating local main...${NC}"
    git fetch origin main:main 2>&1 | sed "s/^/   /"
    
    echo ""
    echo -e "${GREEN}🎉 Done - staying on $BRANCH (main updated)${NC}"
else
    echo ""
    echo -e "${RED}❌ Deploy failed${NC}"
    echo -e "${RED}   Fix the issues and try again.${NC}"
    exit 1
fi
