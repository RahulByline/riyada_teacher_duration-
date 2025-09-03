@echo off
echo ========================================
echo    Test Workshop Creation
echo ========================================
echo.
echo This script will test if workshop creation is working.
echo Make sure you have run the database setup first!
echo.

echo Testing Backend Health...
curl -s http://localhost:5001/health
echo.
echo.

echo Testing Workshops API...
echo GET /api/workshops
curl -s http://localhost:5001/api/workshops
echo.
echo.

echo Testing Workshop Creation...
echo POST /api/workshops
curl -X POST http://localhost:5001/api/workshops ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Workshop\",\"pathway_id\":\"550e8400-e29b-41d4-a716-446655440010\",\"workshop_date\":\"2025-09-03\",\"duration_hours\":2,\"max_participants\":10,\"location\":\"Test Location\"}"
echo.
echo.

echo ========================================
echo    Test Results:
echo ========================================
echo.
echo If you see:
echo ✅ Status 200 for health check - Backend is running
echo ✅ JSON response for GET /api/workshops - API is working
echo ✅ Success message for POST - Workshop creation works!
echo.
echo If you see errors:
echo ❌ Check that database tables were created
echo ❌ Check that backend is running on port 5001
echo ❌ Check TROUBLESHOOTING.md for help
echo.
pause
