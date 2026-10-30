@echo off
setlocal
cd /d "%~dp0"
title Perennial Fallout - Astro Development Server

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 22.23.4 or later is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo npm is missing. Reinstall Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\astro\package.json" (
  echo Installing project dependencies using package-lock.json...
  call npm ci
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Check your internet connection and retry.
    pause
    exit /b 1
  )
)

echo.
echo Starting Astro at http://127.0.0.1:4321
echo Keep this window open; press Ctrl+C to stop the site.
start "" "http://127.0.0.1:4321"
call npm run dev
if errorlevel 1 pause
endlocal
