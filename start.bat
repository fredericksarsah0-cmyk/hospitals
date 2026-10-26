@echo off
title PUIT24210078 HOSPITAL MANAGEMENT SYSTEM
color 0B

echo =========================================================================
echo                PUIT24210078 HOSPITAL MANAGEMENT SYSTEM
echo =========================================================================
echo.
echo Launching Visual Studio Code...
start "" code .

echo Launching Hospital Management Web Application in Default Browser...
start "" "http://localhost:3000"

echo Starting Local Node.js Server on Port 3000...
echo (You can also open index.html directly by double clicking it)
echo.
node server.js

pause
