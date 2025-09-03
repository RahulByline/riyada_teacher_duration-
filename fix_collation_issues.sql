-- Fix collation mismatch issues
-- This script will standardize all tables to use utf8mb4_general_ci collation

-- Fix program_enrollments table collation
ALTER TABLE `program_enrollments` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Update the database default collation
ALTER DATABASE `learning_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Verify the fix by checking if the table exists and can be queried
-- You can manually check the collation by running: SHOW TABLE STATUS LIKE 'program_enrollments';

