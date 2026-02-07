@echo off
echo Testing Resume Analyzer Startup...
echo.

echo Starting MongoDB (if not running)...
net start MongoDB 2>nul
echo.

echo Testing Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo Testing Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers should be starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause