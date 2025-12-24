#!/bin/bash

PI_HOST="root@homeassistant.local"
PI_SCRIPT="/root/deploy.sh"

# Colors
WHITE='\033[1;37m'
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
NC='\033[0m' # No Color

local_echo() {
    echo -e "${WHITE}$1${NC}"
}

pi_echo() {
    echo -e "${RED}$1${NC}"
}

success_echo() {
    echo -e "${GREEN}$1${NC}"
}

timer_start() {
    SECONDS=0
}

timer_show() {
    echo -e "${CYAN}   ⏱  ${SECONDS}s${NC}"
}

BRANCH=$(git branch --show-current)

if [ "$BRANCH" = "main" ]; then
    echo -e "${RED}Error: Switch to a feature branch first.${NC}"
    exit 1
fi

echo ""
local_echo "📤 Pushing $BRANCH to origin..."
git push origin "$BRANCH" 2>&1 | while read line; do local_echo "   $line"; done

echo ""
pi_echo "🍓 Deploying to Pi..."
timer_start

# Stream Pi output in red
ssh "$PI_HOST" "$PI_SCRIPT $BRANCH" 2>&1 | while IFS= read -r line; do
    pi_echo "   $line"
done
EXIT_CODE=${PIPESTATUS[0]}

timer_show

if [ "$EXIT_CODE" -eq 0 ]; then
    echo ""
    success_echo "✅ Deploy succeeded!"
    
    local_echo "📥 Updating local main..."
    git fetch origin main:main 2>&1 | while read line; do local_echo "   $line"; done
    
    echo ""
    success_echo "🎉 Done - staying on $BRANCH (main updated)"
else
    echo ""
    echo -e "${RED}❌ Deploy failed - config check didn't pass${NC}"
    echo -e "${RED}   Fix the issues and try again.${NC}"
    exit 1
fi
