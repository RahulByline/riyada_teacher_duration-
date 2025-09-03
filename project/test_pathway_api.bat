@echo off
echo ========================================
echo TESTING PATHWAY API ENDPOINTS
echo ========================================
echo.

echo 1. Testing GET /api/pathways (should return existing pathways)
echo.
curl -X GET "http://localhost:5001/api/pathways" -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing POST /api/pathways (creating a test pathway)
echo.
curl -X POST "http://localhost:5001/api/pathways" -H "Content-Type: application/json" -d "{\"title\":\"Test Pathway API\",\"description\":\"Testing pathway creation via API\",\"duration\":3,\"total_hours\":45,\"created_by\":\"550e8400-e29b-41d4-a716-446655440001\"}"
echo.
echo.

echo 3. Testing GET /api/pathways again (should now include the new pathway)
echo.
curl -X GET "http://localhost:5001/api/pathways" -H "Content-Type: application/json"
echo.
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo If you see the new pathway in step 3, the API is working correctly.
echo If you see errors, check that:
echo 1. Backend server is running on port 5001
echo 2. Database is connected and tables exist
echo 3. Sample user data exists in the database
echo.
pause
