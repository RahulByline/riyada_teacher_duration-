-- Debug Pathway Creation Issue
-- Run this in MySQL to check what's wrong

USE learning_db;

-- 1. Check if pathways table exists and its structure
SELECT '=== CHECKING PATHWAYS TABLE ===' as status;
SHOW TABLES LIKE 'pathways';

DESCRIBE pathways;

-- 2. Check if users table exists and has the required user
SELECT '=== CHECKING USERS TABLE ===' as status;
SHOW TABLES LIKE 'users';

SELECT id, name, email, role FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- 3. Check if there are any existing pathways
SELECT '=== CHECKING EXISTING PATHWAYS ===' as status;
SELECT COUNT(*) as total_pathways FROM pathways;

-- 4. Try to manually insert a pathway to see the exact error
SELECT '=== TESTING MANUAL INSERT ===' as status;

INSERT INTO pathways (
    title,
    description,
    duration,
    total_hours,
    status,
    created_by
) VALUES (
    'Debug Test Pathway',
    'Testing pathway creation',
    3,
    45,
    'draft',
    '550e8400-e29b-41d4-a716-446655440001'
);

-- 5. Check if it worked
SELECT '=== CHECKING RESULT ===' as status;
SELECT * FROM pathways WHERE title = 'Debug Test Pathway';

-- 6. Clean up test data
DELETE FROM pathways WHERE title = 'Debug Test Pathway';

SELECT '=== DEBUG COMPLETE ===' as status;
