-- Add 'teacher' role to the users table enum
-- This script updates the role enum to include 'teacher' for the teacher training portal

ALTER TABLE `users` 
MODIFY COLUMN `role` enum('admin','trainer','teacher','participant','client') COLLATE utf8mb4_general_ci NOT NULL;

-- Verify the change
DESCRIBE `users`;

