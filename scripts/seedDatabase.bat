@echo off
title Event Finder - Database Seeder
color 0E

echo.
echo ====================================
echo  Event Finder - Database Seeder
echo ====================================
echo.

cd /d %~dp0\..\server

echo Seeding database with sample data...
echo.

npx ts-node --project tsconfig.json src/database/seed.ts

echo.
echo ====================================
echo  Seeding complete!
echo ====================================
echo.
echo Press any key to exit...
pause >nul
