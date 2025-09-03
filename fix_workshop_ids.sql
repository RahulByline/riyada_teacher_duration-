-- Fix existing workshops with empty or invalid IDs
-- This script will update any workshops that have empty string IDs

-- First, check if there are any workshops with empty IDs
SELECT id, title FROM workshops WHERE id = '' OR id IS NULL;

-- Update any workshops with empty IDs to have proper UUIDs
-- Note: This will generate new UUIDs for existing workshops
UPDATE workshops 
SET id = UUID() 
WHERE id = '' OR id IS NULL;

-- Verify the fix
SELECT id, title FROM workshops ORDER BY created_at DESC;

-- You can also check the table structure to ensure ID field is properly configured
DESCRIBE workshops;
