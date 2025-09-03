# Workshop Agenda Management System Setup

## Overview
This system allows you to create and manage complete workshop agendas with different types of activities, time slots, facilitators, and drag-and-drop reordering.

## Features
- ✅ Create workshops with basic information
- ✅ Add multiple agenda items (sessions, breaks, activities, etc.)
- ✅ Set specific time slots for each item
- ✅ Assign facilitators to activities
- ✅ Drag and drop reordering of agenda items
- ✅ Different activity types (session, presentation, break, activity, workshop, etc.)
- ✅ Materials and notes for each agenda item

## Setup Steps

### 1. Create the Database Table
Run the SQL script to create the `workshop_agenda` table:
```bash
mysql -u root -p learning_db < create_workshop_agenda_table.sql
```

### 2. API Endpoints Available

#### Workshop Management
- `GET /api/workshops` - Get all workshops
- `POST /api/workshops` - Create a new workshop
- `GET /api/workshops/:id` - Get workshop by ID
- `PUT /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop

#### Agenda Management
- `GET /api/workshop-agenda/workshop/:workshopId` - Get all agenda items for a workshop
- `POST /api/workshop-agenda` - Create new agenda item
- `PUT /api/workshop-agenda/:id` - Update agenda item
- `DELETE /api/workshop-agenda/:id` - Delete agenda item
- `PUT /api/workshop-agenda/:id/order` - Update single item order
- `PUT /api/workshop-agenda/workshop/:workshopId/reorder` - Bulk reorder items

## Usage Examples

### Creating a Workshop
```javascript
// First create a workshop
const workshop = await fetch('/api/workshops', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pathway_id: 'your-pathway-id',
    title: 'Digital Assessment Workshop',
    description: 'Learn to create effective digital assessments',
    workshop_date: '2025-01-15',
    duration_hours: 8,
    location: 'Conference Room A'
  })
});
```

### Adding Agenda Items
```javascript
// Add agenda items to the workshop
const agendaItems = [
  {
    workshop_id: 'workshop-id',
    title: 'Welcome & Introductions',
    activity_type: 'session',
    start_time: '09:00:00',
    end_time: '09:30:00',
    duration_minutes: 30,
    facilitator_id: 'facilitator-user-id',
    order_index: 1
  },
  {
    workshop_id: 'workshop-id',
    title: 'Coffee Break',
    activity_type: 'break',
    start_time: '10:30:00',
    end_time: '10:45:00',
    duration_minutes: 15,
    order_index: 3
  }
];

// Create each agenda item
for (const item of agendaItems) {
  await fetch('/api/workshop-agenda', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}
```

### Reordering Agenda Items
```javascript
// Reorder agenda items (for drag and drop)
const reorderedItems = [
  { id: 'item-1-id', order_index: 1 },
  { id: 'item-2-id', order_index: 2 },
  { id: 'item-3-id', order_index: 3 }
];

await fetch(`/api/workshop-agenda/workshop/${workshopId}/reorder`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ agendaItems: reorderedItems })
});
```

## Activity Types Available
- **session** - General session/class
- **presentation** - Presentation or lecture
- **break** - Break time (coffee, lunch, etc.)
- **activity** - Hands-on activity or exercise
- **workshop** - Workshop or group work
- **group_work** - Small group activities
- **assessment** - Assessment or evaluation
- **feedback** - Feedback session

## Database Schema

### workshop_agenda Table
```sql
- id (VARCHAR(36)) - Primary key, UUID
- workshop_id (VARCHAR(36)) - Foreign key to workshops table
- title (VARCHAR(255)) - Agenda item title
- description (TEXT) - Detailed description
- activity_type (ENUM) - Type of activity
- start_time (TIME) - Start time
- end_time (TIME) - End time
- duration_minutes (INT) - Duration in minutes
- facilitator_id (VARCHAR(36)) - Foreign key to users table
- order_index (INT) - Display order
- materials_needed (JSON) - Required materials
- notes (TEXT) - Additional notes
- created_at (TIMESTAMP) - Creation timestamp
- updated_at (TIMESTAMP) - Last update timestamp
```

## Frontend Integration

### Drag and Drop Reordering
The system supports drag and drop reordering through the `/reorder` endpoint. When items are reordered in the frontend:

1. Update the local state immediately for smooth UX
2. Send the new order to the backend
3. Handle any errors and revert if needed

### Real-time Updates
Consider implementing WebSocket or polling for real-time updates when multiple users are editing the same workshop agenda.

## Error Handling
All endpoints include proper error handling:
- 400 for validation errors
- 404 for not found
- 500 for server errors

## Security Considerations
- All endpoints validate input data
- UUIDs are generated server-side
- Foreign key constraints ensure data integrity
- Rate limiting is applied to prevent abuse

## Testing
Test the complete workflow:
1. Create a workshop
2. Add multiple agenda items
3. Reorder items
4. Update item details
5. Delete items
6. Verify the final agenda structure

## Troubleshooting
- Ensure the database table is created correctly
- Check that workshop IDs exist before creating agenda items
- Verify time format is HH:MM:SS
- Check foreign key constraints if items aren't being created
