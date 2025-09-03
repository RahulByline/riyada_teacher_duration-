@echo off
echo ========================================
echo TESTING LEARNING EVENTS API
echo ========================================
echo.

echo 1. Testing GET /api/learning-events (should return existing events)
echo.
curl -X GET "http://localhost:5001/api/learning-events" -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing POST /api/learning-events (creating a test event)
echo.
curl -X POST "http://localhost:5001/api/learning-events" -H "Content-Type: application/json" -d "{\"pathway_id\":\"550e8400-e29b-41d4-a716-446655440010\",\"title\":\"Test Event\",\"description\":\"Test Description\",\"type\":\"workshop\",\"start_date\":\"2025-01-20T10:00:00.000Z\",\"end_date\":\"2025-01-20T12:00:00.000Z\",\"duration\":2,\"format\":\"online\",\"objectives\":[\"Test objective\"],\"resources\":[],\"dependencies\":[]}"
echo.
echo.

echo 3. Testing GET /api/learning-events again (should now include the new event)
echo.
curl -X GET "http://localhost:5001/api/learning-events" -H "Content-Type: application/json"
echo.
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo If you see the new event in step 3, the API is working correctly.
echo If you see errors, check the backend console for specific error messages.
echo.
pause
