@echo off
echo ========================================
echo    API Endpoints Testing
echo ========================================
echo.
echo This script will test all API endpoints to ensure they're working.
echo Make sure your backend server is running on port 5001.
echo.

echo Testing Health Check...
curl -s http://localhost:5001/health
echo.
echo.

echo Testing Curriculum Endpoints...
echo GET /api/curriculum/grades
curl -s http://localhost:5001/api/curriculum/grades
echo.
echo.

echo Testing Teacher Nominations...
echo GET /api/teacher-nominations
curl -s http://localhost:5001/api/teacher-nominations
echo.
echo.

echo Testing Pathways...
echo GET /api/pathways
curl -s http://localhost:5001/api/pathways
echo.
echo.

echo Testing Users...
echo GET /api/users
curl -s http://localhost:5001/api/users
echo.
echo.

echo Testing Workshops...
echo GET /api/workshops
curl -s http://localhost:5001/api/workshops
echo.
echo.

echo Testing Resources...
echo GET /api/resources
curl -s http://localhost:5001/api/resources
echo.
echo.

echo Testing Progress Tracking...
echo GET /api/progress
curl -s http://localhost:5001/api/progress
echo.
echo.

echo ========================================
echo    Testing Complete!
echo ========================================
echo.
echo If you see JSON responses above, the API is working.
echo If you see connection errors, make sure the backend is running.
echo.
pause
