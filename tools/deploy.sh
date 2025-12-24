#!/bin/bash

PI_HOST="root@homeassistant.local"
PI_SCRIPT="/root/deploy.sh"

BRANCH=$(git branch --show-current)

if [ "$BRANCH" = "main" ]; then
    echo "Error: Switch to a feature branch first."
    exit 1
fi

echo "Pushing $BRANCH to origin..."
git push origin "$BRANCH"

echo "Deploying to Pi..."
if ssh "$PI_HOST" "$PI_SCRIPT $BRANCH"; then
    echo ""
    echo "Deploy succeeded! Pulling main..."
    git checkout main
    git pull origin main
    echo "Done - you're on updated main"
else
    echo ""
    echo "Deploy failed - config check didn't pass"
    echo "Fix the issues and try again."
    exit 1
fi

