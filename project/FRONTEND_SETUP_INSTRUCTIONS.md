# Frontend Setup Instructions

## Environment Configuration

To fix the API URL issue, you need to create a `.env` file in the project root directory.

### Step 1: Create .env file

Create a file named `.env` in the project root directory (same level as `package.json`) with the following content:

```bash
# Frontend Environment Configuration
# Backend API URL (supports all frontend ports: 5173, 5174, 5175, 5176)
VITE_API_URL=http://localhost:5001/api

# App Configuration
VITE_APP_TITLE=Learning Pathway Portal
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

### Step 2: Restart the frontend development server

After creating the `.env` file, restart your frontend development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## What This Fixes

- **API URL Issue**: The frontend was sending requests to `http://localhost:5173/api/...` instead of `http://localhost:5001/api/...`
- **Centralized Configuration**: All API endpoints now use the centralized configuration from `src/config/api.ts`
- **Environment Flexibility**: Easy to change API URLs for different environments (development, staging, production)

## Files Updated

The following files have been updated to use the correct API configuration:

- `src/components/workshop/WorkshopAgendaManager.tsx`
- `src/hooks/useWorkshopAgenda.ts`
- `src/config/api.ts` (new centralized configuration)

## Verification

After setting up the `.env` file and restarting the server, the workshop agenda system should:

1. ✅ Send requests to the correct backend URL (`http://localhost:5001/api/workshop-agenda`)
2. ✅ Successfully create, read, update, and delete agenda items
3. ✅ Support drag-and-drop reordering
4. ✅ Handle facilitator assignment
5. ✅ Manage multiple activity types

## Troubleshooting

If you still see API errors:

1. **Check .env file location**: Ensure it's in the project root (not in `src/` or `backend/`)
2. **Verify backend is running**: Ensure your backend server is running on port 5001
3. **Check file permissions**: Ensure the `.env` file is readable
4. **Restart frontend**: Always restart the development server after creating/modifying `.env`

## Next Steps

Once the API URL issue is resolved, you can:

1. Test the workshop agenda creation
2. Add different types of agenda items (sessions, breaks, activities)
3. Test drag-and-drop reordering
4. Assign facilitators to agenda items
5. Integrate with the main workshop planner interface
