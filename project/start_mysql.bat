@echo off
echo ========================================
echo Learning Pathway - MySQL Backend Setup
echo ========================================
echo.

echo Starting MySQL Backend Server...
echo.

cd backend

echo Installing dependencies...
npm install

echo.
echo Starting server...
echo Backend will be available at: http://localhost:5001
echo Health check: http://localhost:5001/health
echo.

npm run dev

pause
