@echo off
title ECCSA website
cd /d "%~dp0"
echo.
echo  ============================================
echo    ECCSA website - starting on this computer
echo  ============================================
echo.
docker info >nul 2>&1
if errorlevel 1 (
  echo  Docker Desktop is not running.
  echo  Please open Docker Desktop, wait until it says "Engine running", then double-click this file again.
  echo.
  pause
  exit /b 1
)
echo  The first start takes 5-15 minutes. Please wait...
echo.
docker compose -f docker-compose.desktop.yml up -d --build
if errorlevel 1 (
  echo.
  echo  Something went wrong. Please send a screenshot of this window.
  pause
  exit /b 1
)
echo.
echo  Waiting for the website to be ready...
:wait
curl -s -o nul http://localhost:3080/en
if errorlevel 1 (
  timeout /t 3 /nobreak >nul
  goto wait
)
start http://localhost:3080
start http://localhost:3080/admin
echo.
echo  READY!
echo    Website: http://localhost:3080
echo    Admin:   http://localhost:3080/admin
echo    Email:   admin@ethiopianchamber.com
echo    Password: Eccsa@2026!
echo.
echo  To stop the website, double-click STOP-ECCSA-WINDOWS.bat
echo.
pause
