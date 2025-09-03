-- Fix Learning Events Table Structure
-- This script fixes the PRIMARY KEY issue with the learning_events table

USE learning_db;

-- First, let's check the current table structure
SELECT '=== CURRENT TABLE STRUCTURE ===' as status;
DESCRIBE learning_events;

-- Check if there are any existing events
SELECT '=== EXISTING EVENTS ===' as status;
SELECT COUNT(*) as total_events FROM learning_events;

-- Drop the existing table and recreate it with proper UUID handling
DROP TABLE IF EXISTS learning_events;

CREATE TABLE learning_events (
    id VARCHAR(36) PRIMARY KEY,
    pathway_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('workshop', 'elearning', 'assessment', 'assignment', 'group', 'checkpoint') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    duration INT DEFAULT 0,
    format ENUM('online', 'offline', 'blended') DEFAULT 'online',
    objectives JSON,
    resources JSON,
    dependencies JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE
);

-- Create a trigger to automatically generate UUID for new records
DELIMITER //
CREATE TRIGGER before_learning_events_insert 
BEFORE INSERT ON learning_events
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = UUID();
    END IF;
END//
DELIMITER ;

SELECT '=== TABLE RECREATED SUCCESSFULLY ===' as status;
DESCRIBE learning_events;

-- Test inserting a sample event
SELECT '=== TESTING INSERT ===' as status;
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
    '550e8400-e29b-41d4-a716-446655440010',
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

-- Check if it worked
SELECT '=== CHECKING RESULT ===' as status;
SELECT * FROM learning_events WHERE title = 'Test Event';

-- Clean up test data
DELETE FROM learning_events WHERE title = 'Test Event';

SELECT '=== FIX COMPLETE ===' as status;
