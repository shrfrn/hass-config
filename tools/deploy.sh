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

# Spinner characters
SPINNER='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

# Current stage tracking
CURRENT_STAGE=""
STAGE_START=0
OUTPUT_LINES=()

# Process SSH output in real-time
SECONDS=0
exec 3< <(ssh "$PI_HOST" "$PI_SCRIPT $BRANCH" 2>&1; echo "[EXIT:$?]")

while IFS= read -r line <&3; do
    case "$line" in
        "[STAGE:CHECK]")
            CURRENT_STAGE="check"
            STAGE_START=$SECONDS
            printf "   ${YELLOW}◐${NC} Config check running...  "
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
            printf "   ${YELLOW}◐${NC} Restarting Home Assistant...  "
            ;;
        "[STAGE:RESTART_DONE]")
            ELAPSED=$((SECONDS - STAGE_START))
            printf "\r   ${GREEN}✓${NC} Home Assistant restarted ${DIM}(${ELAPSED}s)${NC}          \n"
            CURRENT_STAGE=""
            ;;
        "[EXIT:"*)
            EXIT_CODE="${line#[EXIT:}"
            EXIT_CODE="${EXIT_CODE%]}"
            ;;
        *)
            # Store non-marker lines for later display
            OUTPUT_LINES+=("$line")
            ;;
    esac
done

exec 3<&-

# Show Pi output
echo ""
echo -e "${DIM}── Pi log ──${NC}"
for line in "${OUTPUT_LINES[@]}"; do
    echo -e "   ${DIM}│${NC} $line"
done
echo -e "${DIM}────────────${NC}"

TOTAL_TIME=$SECONDS

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
