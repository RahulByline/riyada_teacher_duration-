-- Fix the database default collation
ALTER DATABASE `learning_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Fix program_enrollments table specifically (this was causing the main issue)
ALTER TABLE `program_enrollments` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Fix other tables that commonly have collation issues
-- You can run these manually if needed:

-- Fix workshops table
ALTER TABLE `workshops` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Fix teacher_nominations table
ALTER TABLE `teacher_nominations` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Fix users table
ALTER TABLE `users` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Fix pathways table
ALTER TABLE `pathways` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Verify the fix by checking if tables can be queried
-- You can manually check collations by running: SHOW TABLE STATUS;
