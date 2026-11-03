#!/bin/bash
cd "$(dirname "$0")"
docker compose -f docker-compose.desktop.yml stop
echo "ECCSA website stopped. Your content is kept for next time."
