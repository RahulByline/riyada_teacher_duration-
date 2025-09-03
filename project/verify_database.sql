-- Database Verification Script
-- Run this to ensure all tables are properly created

USE learning_db;

-- Show all tables
SHOW TABLES;

-- Check table structures
DESCRIBE users;
DESCRIBE pathways;
DESCRIBE learning_events;
DESCRIBE participants;
DESCRIBE assessments;
DESCRIBE certificates;
DESCRIBE feedback_responses;
DESCRIBE branding_settings;
DESCRIBE workshops;
DESCRIBE resources;
DESCRIBE progress_tracking;
DESCRIBE teacher_nominations;
DESCRIBE program_enrollments;
DESCRIBE grades;
DESCRIBE subjects;
DESCRIBE units;
DESCRIBE lessons;

-- Check data counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Pathways', COUNT(*) FROM pathways
UNION ALL
SELECT 'Learning Events', COUNT(*) FROM learning_events
UNION ALL
SELECT 'Participants', COUNT(*) FROM participants
UNION ALL
SELECT 'Assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'Workshops', COUNT(*) FROM workshops
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources
UNION ALL
SELECT 'Progress Tracking', COUNT(*) FROM progress_tracking
UNION ALL
SELECT 'Branding Settings', COUNT(*) FROM branding_settings
UNION ALL
SELECT 'Grades', COUNT(*) FROM grades
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'Units', COUNT(*) FROM units
UNION ALL
SELECT 'Teacher Nominations', COUNT(*) FROM teacher_nominations;

-- Check sample data
SELECT 'Sample Users' as info, COUNT(*) as count FROM users LIMIT 1;
SELECT 'Sample Grades' as info, COUNT(*) as count FROM grades LIMIT 1;
SELECT 'Sample Subjects' as info, COUNT(*) as count FROM subjects LIMIT 1;

-- Verify indexes exist
SHOW INDEX FROM users;
SHOW INDEX FROM grades;
SHOW INDEX FROM subjects;
SHOW INDEX FROM units;
SHOW INDEX FROM lessons;
