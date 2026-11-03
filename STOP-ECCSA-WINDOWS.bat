@echo off
cd /d "%~dp0"
docker compose -f docker-compose.desktop.yml stop
echo ECCSA website stopped. Your content is kept for next time.
pause
