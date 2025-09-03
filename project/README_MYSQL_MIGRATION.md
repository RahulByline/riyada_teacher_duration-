# MySQL Migration Setup Guide

This guide will help you migrate your Learning Pathway Application from Supabase to MySQL.

## Prerequisites

1. **MySQL Server** (version 8.0 or higher)
2. **Node.js** (version 18 or higher)
3. **npm** or **yarn**

## Step 1: Database Setup

### 1.1 Install MySQL Server
- **Windows**: Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- **macOS**: Use Homebrew: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server` (Ubuntu/Debian)

### 1.2 Start MySQL Service
```bash
# Windows (as Administrator)
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 1.3 Create Database
1. Connect to MySQL as root:
```bash
mysql -u root
```

2. Run the database setup script:
```sql
source mysql_setup.sql;
```

Or copy and paste the contents of `mysql_setup.sql` directly into your MySQL client.

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Edit `.env` file with your MySQL credentials:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=learning_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.3 Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Step 3: Frontend Setup

### 3.1 Configure Frontend Environment
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Edit `.env` file:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_TITLE=Learning Pathway Portal
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

### 3.2 Update Frontend Dependencies
The frontend now uses the MySQL client instead of Supabase. Update your imports:

```typescript
// Old Supabase import
import { supabase } from '../lib/supabase';

// New MySQL import
import { mysqlClient } from '../lib/mysql';
// OR for backward compatibility
import { supabase } from '../lib/mysql';
```

### 3.3 Start Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 4: Verify Migration

### 4.1 Check Backend Health
Visit: `http://localhost:5000/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "Connected",
  "uptime": 123.456
}
```

### 4.2 Test API Endpoints
Test the authentication endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### 4.3 Check Database Tables
Connect to MySQL and verify tables:
```sql
USE learning_db;
SHOW TABLES;
```

## Database Schema Overview

The migration includes the following tables:

- **users**: User accounts and authentication
- **pathways**: Learning pathways/programs
- **learning_events**: Individual learning activities
- **participants**: User enrollments in pathways
- **assessments**: User skill assessments
- **certificates**: Generated completion certificates
- **feedback_responses**: User feedback on events
- **branding_settings**: Portal customization
- **workshops**: Workshop management and scheduling
- **resources**: Learning resources and materials
- **progress_tracking**: Student progress monitoring
- **grades**: Academic grade levels and scoring
- **subjects**: Curriculum subjects and categories
- **units**: Subject units and modules
- **lessons**: Individual lesson content

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Pathways
- `GET /api/pathways` - Get all pathways
- `GET /api/pathways/:id` - Get pathway by ID
- `POST /api/pathways` - Create pathway
- `PUT /api/pathways/:id` - Update pathway
- `DELETE /api/pathways/:id` - Delete pathway

### Learning Events
- `GET /api/learning-events` - Get all events
- `GET /api/learning-events/pathway/:pathwayId` - Get events by pathway
- `POST /api/learning-events` - Create event

### Participants
- `GET /api/participants` - Get all participants
- `GET /api/participants/pathway/:pathwayId` - Get participants by pathway
- `POST /api/participants` - Enroll participant

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create assessment

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Generate certificate

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback

### Branding
- `GET /api/branding` - Get branding settings
- `PUT /api/branding` - Update branding settings

### Workshops
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops` - Create workshop
- `PUT /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Progress Tracking
- `GET /api/progress` - Get all progress records
- `GET /api/progress/:id` - Get progress by ID
- `POST /api/progress` - Create progress record
- `PUT /api/progress/:id` - Update progress record
- `DELETE /api/progress/:id` - Delete progress record

### Curriculum
- `GET /api/curriculum/grades` - Get all grades
- `GET /api/curriculum/grades/:id` - Get grade by ID
- `POST /api/curriculum/grades` - Create grade
- `PUT /api/curriculum/grades/:id` - Update grade
- `DELETE /api/curriculum/grades/:id` - Delete grade
- `GET /api/curriculum/subjects` - Get all subjects
- `GET /api/curriculum/units` - Get all units
- `GET /api/curriculum/lessons` - Get all lessons

### Teacher Nominations
- `GET /api/teacher-nominations` - Get all teacher nominations
- `GET /api/teacher-nominations/:id` - Get nomination by ID
- `POST /api/teacher-nominations` - Create nomination
- `PUT /api/teacher-nominations/:id/status` - Update nomination status
- `POST /api/teacher-nominations/:id/enroll` - Enroll teacher in program
- `GET /api/teacher-nominations/:id/enrollments` - Get program enrollments

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MySQL service is running
   - Check database credentials in `.env`
   - Ensure database `learning_db` exists

2. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Update `VITE_API_URL` in frontend `.env`

3. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check that frontend is running on the correct port

4. **JWT Errors**
   - Ensure `JWT_SECRET` is set in backend `.env`
   - Check token expiration settings

### Logs and Debugging

Backend logs will show:
- Database connection status
- API request/response details
- Error stack traces (in development)

Frontend console will show:
- API call results
- Authentication status
- Error messages

## Security Considerations

1. **Change Default JWT Secret**: Update `JWT_SECRET` in production
2. **Database Password**: Set a strong password for MySQL root user
3. **Environment Variables**: Never commit `.env` files to version control
4. **Rate Limiting**: Adjust rate limits based on your needs
5. **CORS**: Restrict CORS origins in production

## Performance Optimization

1. **Database Indexes**: Already included in the setup script
2. **Connection Pooling**: Configured with optimal settings
3. **Query Optimization**: Use prepared statements (already implemented)
4. **Caching**: Consider adding Redis for session storage

## Next Steps

1. **Data Migration**: If you have existing Supabase data, create migration scripts
2. **Testing**: Implement comprehensive testing for all endpoints
3. **Monitoring**: Add logging and monitoring solutions
4. **Deployment**: Prepare for production deployment
5. **Backup**: Set up automated database backups

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs for error details
3. Verify database connectivity
4. Test API endpoints individually

---

**Migration Complete!** 🎉

Your Learning Pathway Application is now running on MySQL with a robust Node.js backend.
