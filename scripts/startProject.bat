@echo off
title Event Finder - Project Starter
color 0A

echo.
echo ====================================
echo  Event Finder - Starting Project
echo ====================================
echo.

:: Check if MongoDB is running
echo Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed or not in PATH
    echo Please ensure MongoDB is running before starting the server
) else (
    echo [OK] MongoDB found
)

echo.
echo Starting servers...
echo.

:: Start the server in a new window
echo [1/2] Starting NestJS Server...
start "Event Finder - Server" cmd /k "cd /d %~dp0\server && npm run start:dev"

:: Wait a bit for the server to start
timeout /t 3 /nobreak >nul

:: Start the client in a new window
echo [2/2] Starting Vite Client...
start "Event Finder - Client" cmd /k "cd /d %~dp0\client && npm run dev"

echo.
echo ====================================
echo  Both servers are starting!
echo ====================================
echo.
echo Server:  http://localhost:3000
echo Client:  http://localhost:5173
echo API Docs: http://localhost:3000/api/docs
echo.
echo Press any key to exit this window...
pause >nul
