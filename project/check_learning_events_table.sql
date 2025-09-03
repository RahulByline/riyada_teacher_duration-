-- Check Learning Events Table Structure
-- Run this to see if the table was fixed

USE learning_db;

-- Check current table structure
SELECT '=== CURRENT TABLE STRUCTURE ===' as status;
DESCRIBE learning_events;

-- Check if there are any existing events
SELECT '=== EXISTING EVENTS ===' as status;
SELECT COUNT(*) as total_events FROM learning_events;

-- Check the most recent events
SELECT '=== MOST RECENT EVENTS ===' as status;
SELECT id, title, type, created_at FROM learning_events ORDER BY created_at DESC LIMIT 5;

-- Check if the table has proper UUID handling
SELECT '=== CHECKING ID FORMAT ===' as status;
SELECT id, LENGTH(id) as id_length FROM learning_events LIMIT 3;

-- Test if we can insert a new event manually
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
    'cb9a90a8-88b8-11f0-8dc0-d843aec570fe',
    'Manual Test Event',
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

-- Check if it worked
SELECT '=== CHECKING MANUAL INSERT RESULT ===' as status;
SELECT * FROM learning_events WHERE title = 'Manual Test Event';

-- Clean up test data
DELETE FROM learning_events WHERE title = 'Manual Test Event';

SELECT '=== CHECK COMPLETE ===' as status;
