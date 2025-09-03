@echo off
echo ========================================
echo    Learning Pathway - Startup Script
echo ========================================
echo.
echo This script will help you start the application properly.
echo.

echo Step 1: Checking MySQL Database...
echo Please ensure MySQL is running and the database is created.
echo Run the following SQL script in MySQL:
echo   source mysql_complete_setup.sql
echo.

echo Step 2: Starting Backend Server...
echo.
cd backend
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo .env file created! Please check the configuration.
    echo.
)

echo Installing backend dependencies...
npm install

echo Starting backend server on port 5001...
start "Backend Server" cmd /k "npm run dev"

echo.
echo Step 3: Starting Frontend...
echo.
cd ..
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo .env file created! Please check the configuration.
    echo.
)

echo Installing frontend dependencies...
npm install

echo Starting frontend on port 5173...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Application Starting...
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo Health Check: http://localhost:5001/health
echo.
echo Please wait for both servers to start up.
echo Check the console windows for any error messages.
echo.
echo Press any key to open the application...
pause > nul

start http://localhost:5173
start http://localhost:5001/health

echo.
echo Application should now be running!
echo If you encounter issues, check:
echo 1. MySQL is running and accessible
echo 2. Database 'learning_db' exists with all tables
echo 3. Both servers started without errors
echo 4. Browser console for any JavaScript errors
echo.
pause
