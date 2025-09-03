-- Check Current Database State and Fix Issues
-- Run this in MySQL to see what's actually there and fix problems

USE learning_db;

-- Show all existing tables
SHOW TABLES;

-- Check the structure of key tables
DESCRIBE subjects;
DESCRIBE grades;
DESCRIBE workshops;
DESCRIBE resources;

-- Check if tables have the right columns
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'learning_db' 
AND TABLE_NAME IN ('subjects', 'grades', 'workshops', 'resources')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
