-- Test Event Creation
-- Run this in MySQL to check what's wrong

USE learning_db;

-- 1. Check if learning_events table exists and its structure
SELECT '=== CHECKING LEARNING_EVENTS TABLE ===' as status;
SHOW TABLES LIKE 'learning_events';

DESCRIBE learning_events;

-- 2. Check if there are any existing events
SELECT '=== CHECKING EXISTING EVENTS ===' as status;
SELECT COUNT(*) as total_events FROM learning_events;

-- 3. Check if the pathway exists
SELECT '=== CHECKING PATHWAY ===' as status;
SELECT id, title FROM pathways LIMIT 1;

-- 4. Try to manually insert an event to see the exact error
SELECT '=== TESTING MANUAL INSERT ===' as status;

INSERT INTO learning_events (
    pathway_id,
    title,
    description,
    type,
    start_date,
    end_date,
    duration,
    format,
    objectives,
    resources,
    dependencies
) VALUES (
    '550e8400-e29b-41d4-a716-446655440010', -- Use an existing pathway ID
    'Test Event',
    'Test Description',
    'workshop',
    '2025-01-20 10:00:00',
    '2025-01-20 12:00:00',
    2,
    'online',
    '["Test objective"]',
    '[]',
    '[]'
);

-- 5. Check if it worked
SELECT '=== CHECKING RESULT ===' as status;
SELECT * FROM learning_events WHERE title = 'Test Event';

-- 6. Clean up test data
DELETE FROM learning_events WHERE title = 'Test Event';

SELECT '=== TEST COMPLETE ===' as status;
