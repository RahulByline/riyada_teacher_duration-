@echo off
echo ========================================
echo CHECKING BACKEND STATUS
echo ========================================
echo.

echo 1. Checking if backend is running on port 5001...
echo.
netstat -an | findstr :5001
echo.

echo 2. Testing backend health endpoint...
echo.
curl -X GET "http://localhost:5001/health" -H "Content-Type: application/json"
echo.
echo.

echo 3. Testing CORS preflight (OPTIONS request)...
echo.
curl -X OPTIONS "http://localhost:5001/api/pathways" -H "Origin: http://localhost:5174" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -v
echo.
echo.

echo 4. Testing direct pathway endpoint...
echo.
curl -X GET "http://localhost:5001/api/pathways" -H "Origin: http://localhost:5174" -H "Content-Type: application/json"
echo.
echo.

echo ========================================
echo DIAGNOSIS COMPLETE
echo ========================================
echo.
echo If you see "LISTENING" in step 1, the backend is running.
echo If you see errors in steps 2-4, there's a backend issue.
echo.
echo NEXT STEPS:
echo 1. Make sure backend is running: cd backend && npm start
echo 2. Check if port 5001 is available
echo 3. Restart backend after CORS changes
echo.
pause
