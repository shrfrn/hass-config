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

# Create a temp file for SSH output
TEMP_OUTPUT=$(mktemp)

# Run SSH in background, capture output
ssh "$PI_HOST" "$PI_SCRIPT $BRANCH" > "$TEMP_OUTPUT" 2>&1 &
SSH_PID=$!

# Show spinner with timer while waiting
SPINNER='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
SECONDS=0
i=0
while kill -0 $SSH_PID 2>/dev/null; do
    printf "\r   ${YELLOW}${SPINNER:i++%10:1}${NC} Running on Pi... ${DIM}${SECONDS}s${NC}  "
    sleep 0.1
done
printf "\r   ${GREEN}✓${NC} Completed in ${SECONDS}s          \n"

# Get exit code
wait $SSH_PID
EXIT_CODE=$?

# Show Pi output with subtle prefix
echo ""
echo -e "${DIM}── Pi output ──${NC}"
while IFS= read -r line; do
    echo -e "   ${DIM}│${NC} $line"
done < "$TEMP_OUTPUT"
echo -e "${DIM}───────────────${NC}"
rm -f "$TEMP_OUTPUT"

if [ "$EXIT_CODE" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy succeeded!${NC}"
    
    echo -e "${WHITE}📥 Updating local main...${NC}"
    git fetch origin main:main 2>&1 | sed "s/^/   /"
    
    echo ""
    echo -e "${GREEN}🎉 Done - staying on $BRANCH (main updated)${NC}"
else
    echo ""
    echo -e "${RED}❌ Deploy failed - config check didn't pass${NC}"
    echo -e "${RED}   Fix the issues and try again.${NC}"
    exit 1
fi
