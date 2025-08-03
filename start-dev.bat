@echo off
echo Starting Mini LinkedIn Platform...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3

echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause
