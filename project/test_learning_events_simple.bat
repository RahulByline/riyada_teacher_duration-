@echo off
echo ========================================
echo TESTING LEARNING EVENTS - SIMPLE
echo ========================================
echo.

echo 1. Testing GET /api/learning-events (should return existing events)
echo.
curl -X GET "http://localhost:5001/api/learning-events" -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing POST /api/learning-events (creating a simple event)
echo.
curl -X POST "http://localhost:5001/api/learning-events" -H "Content-Type: application/json" -d "{\"pathway_id\":\"cb9a90a8-88b8-11f0-8dc0-d843aec570fe\",\"title\":\"Simple Test Event\",\"description\":\"Test Description\",\"type\":\"workshop\",\"start_date\":\"2025-01-20 10:00:00\",\"end_date\":\"2025-01-20 12:00:00\",\"duration\":2,\"format\":\"online\",\"objectives\":[\"Test objective\"],\"resources\":[],\"dependencies\":[]}"
echo.
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
pause
