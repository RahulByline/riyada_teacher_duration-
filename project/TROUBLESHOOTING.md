# Learning Pathway Application - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Import Errors (Already Fixed)
- ✅ All Supabase imports have been updated to use MySQL client
- ✅ New `useMySQL.ts` hooks created for database operations
- ✅ All components updated to use new hooks

### 2. Port Configuration Issues
**Problem**: Frontend trying to connect to wrong backend port
**Solution**: 
- Backend runs on port 5001
- Frontend configured to connect to `http://localhost:5001/api`
- Check `src/lib/mysql.ts` has correct API_BASE_URL

### 3. Database Connection Issues
**Problem**: Backend can't connect to MySQL
**Solution**:
1. Ensure MySQL service is running
2. Verify database `learning_db` exists
3. Check credentials in `backend/.env`
4. Run `mysql_complete_setup.sql` to create tables

### 4. API Endpoint Errors
**Problem**: 500 Internal Server Error on API calls
**Solution**:
1. Check backend server is running
2. Verify database tables exist
3. Check backend console for error logs
4. Test endpoints with `test_api_endpoints.bat`

### 5. Frontend Not Loading Data
**Problem**: Components show loading state indefinitely
**Solution**:
1. Check browser console for errors
2. Verify backend is accessible at `http://localhost:5001`
3. Check network tab for failed API calls
4. Ensure CORS is properly configured

## 🔧 Step-by-Step Startup Process

### Step 1: Database Setup
```sql
-- Connect to MySQL as root
mysql -u root

-- Create and setup database
source mysql_complete_setup.sql;

-- Verify tables
source verify_database.sql;
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run dev
```

**Expected Output**:
```
🚀 Server running on port 5001
📊 Health check: http://localhost:5001/health
🔗 Frontend URL: http://localhost:5173
✅ MySQL Database connected successfully
```

### Step 3: Frontend Setup
```bash
cd project
npm install
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Test Application
1. Open `http://localhost:5173` in browser
2. Check browser console for errors
3. Navigate to different sections
4. Test data creation/editing

## 🧪 Testing Checklist

### Backend Health
- [ ] `http://localhost:5001/health` returns OK status
- [ ] Database connection successful
- [ ] All routes loaded without errors

### API Endpoints
- [ ] `GET /api/curriculum/grades` - Returns grade data
- [ ] `GET /api/teacher-nominations` - Returns nomination data
- [ ] `GET /api/pathways` - Returns pathway data
- [ ] `GET /api/users` - Returns user data

### Frontend Functionality
- [ ] Application loads without errors
- [ ] Navigation works between sections
- [ ] Data displays in components
- [ ] Forms can submit data
- [ ] No console errors

### Database Operations
- [ ] Data can be created (POST requests)
- [ ] Data can be read (GET requests)
- [ ] Data can be updated (PUT requests)
- [ ] Data can be deleted (DELETE requests)

## 🐛 Debugging Tools

### 1. Backend Logs
Check backend console for:
- Database connection status
- API request/response logs
- Error stack traces

### 2. Frontend Console
Check browser console for:
- JavaScript errors
- API call failures
- Authentication issues

### 3. Network Tab
Check browser Network tab for:
- Failed HTTP requests
- Response status codes
- Request/response payloads

### 4. Database Verification
Run verification scripts:
- `verify_database.sql` - Check table structure
- `test_api_endpoints.bat` - Test API functionality

## 🚀 Quick Fix Commands

### Restart Everything
```bash
# Stop all servers (Ctrl+C in each terminal)
# Then run:
start_application.bat
```

### Reset Database
```sql
-- In MySQL:
DROP DATABASE IF EXISTS learning_db;
CREATE DATABASE learning_db;
USE learning_db;
source mysql_complete_setup.sql;
```

### Clear Frontend Cache
```bash
# In project directory:
rm -rf node_modules/.vite
npm run dev
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs**: Backend console and browser console
2. **Verify database**: Run `verify_database.sql`
3. **Test API**: Run `test_api_endpoints.bat`
4. **Check ports**: Ensure no port conflicts
5. **Restart services**: MySQL, Backend, Frontend

## 🎯 Expected Behavior

### Working Application Should:
- ✅ Load without import errors
- ✅ Display curriculum data (grades, subjects, units)
- ✅ Show teacher nominations
- ✅ Allow data creation/editing
- ✅ Store data in MySQL database
- ✅ Handle all CRUD operations
- ✅ Provide proper error messages
- ✅ Work across all browser tabs

---

**Remember**: The application is now fully migrated from Supabase to MySQL. All data operations should work seamlessly with your local MySQL database.
