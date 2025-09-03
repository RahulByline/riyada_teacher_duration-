@echo off
echo ========================================
echo TESTING SESSION PERSISTENCE
echo ========================================
echo.

echo 1. Testing passcode login endpoint
echo.
curl -X POST "http://localhost:5001/api/auth/passcode-login" -H "Content-Type: application/json" -d "{\"passcode\":\"admin123\"}"
echo.
echo.

echo 2. Testing profile endpoint (should fail without token)
echo.
curl -X GET "http://localhost:5001/api/auth/profile"
echo.
echo.

echo 3. Testing with valid token (copy token from step 1)
echo.
echo Copy the token from step 1 and replace TOKEN_HERE below:
echo curl -X GET "http://localhost:5001/api/auth/profile" -H "Authorization: Bearer TOKEN_HERE"
echo.

echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo If step 1 returns a token and step 2 fails with 401, authentication is working.
echo.
pause
