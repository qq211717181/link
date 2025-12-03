#!/usr/bin/env bash

set -euo pipefail

LOG_DIR="$(pwd)/log"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/dev-all-$(date +%Y%m%d-%H%M%S).log"

echo "Starting npm run dev:all in background..."
echo "Logs: $LOG_FILE"

nohup npm run dev:all > "$LOG_FILE" 2>&1 &
PID=$!
echo $PID > "$LOG_DIR/dev-all.pid"

echo "Process started with PID $PID"
echo "PID stored in $LOG_DIR/dev-all.pid"