#!/bin/bash
cd "$(dirname "$0")"
echo "ECCSA website - starting on this computer"
if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop is not running. Open Docker Desktop, wait until it is running, then try again."
  read -n 1 -s -r -p "Press any key to close"; exit 1
fi
echo "The first start takes 5-15 minutes. Please wait..."
docker compose -f docker-compose.desktop.yml up -d --build || { echo "Something went wrong. Please send a screenshot."; read -n 1 -s -r; exit 1; }
until curl -s -o /dev/null http://localhost:3000/en; do sleep 3; done
open http://localhost:3000; open http://localhost:3000/admin
echo ""
echo "READY!  Website: http://localhost:3000   Admin: http://localhost:3000/admin"
echo "Email: admin@ethiopianchamber.com   Password: Eccsa@2026!"
read -n 1 -s -r -p "Press any key to close this window"
