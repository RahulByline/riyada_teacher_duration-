-- =====================================================
-- COMPLETE DATABASE SETUP FOR LEARNING PATHWAY
-- =====================================================
-- This script creates ALL tables needed for the application
-- Run this after creating a fresh database
-- =====================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS learning_db;
USE learning_db;

-- =====================================================
-- 1. USERS TABLE (Authentication & User Management)
-- =====================================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'trainer', 'participant', 'client') NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. PATHWAYS TABLE (Learning Programs)
-- =====================================================
CREATE TABLE pathways (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT DEFAULT 0,
    total_hours INT DEFAULT 0,
    status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
    cefr_level VARCHAR(10),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 3. LEARNING EVENTS TABLE (Workshops, Assessments, etc.)
-- =====================================================
CREATE TABLE learning_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pathway_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('workshop', 'elearning', 'assessment', 'assignment', 'group', 'checkpoint') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INT DEFAULT 0,
    format ENUM('online', 'offline', 'blended') DEFAULT 'online',
    objectives JSON,
    resources JSON,
    dependencies JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. WORKSHOPS TABLE (Specific Workshop Management)
-- =====================================================
CREATE TABLE workshops (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pathway_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    facilitator_id VARCHAR(36),
    max_participants INT DEFAULT 20,
    workshop_date DATE NOT NULL,
    duration_hours INT NOT NULL,
    location VARCHAR(255),
    materials_required JSON,
    prerequisites JSON,
    status ENUM('draft', 'planning', 'ready', 'in-progress', 'completed', 'cancelled') DEFAULT 'draft',
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (facilitator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 5. PARTICIPANTS TABLE (User Enrollment in Pathways)
-- =====================================================
CREATE TABLE participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    pathway_id VARCHAR(36) NOT NULL,
    enrollment_date DATE NOT NULL,
    completion_date DATE NULL,
    progress INT DEFAULT 0,
    cefr_level_start VARCHAR(10),
    cefr_level_current VARCHAR(10),
    cefr_level_target VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. ASSESSMENTS TABLE (Student Evaluations)
-- =====================================================
CREATE TABLE assessments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    assessment_date DATE NOT NULL,
    overall_level VARCHAR(10) NOT NULL,
    skill_levels JSON NOT NULL,
    recommendations JSON,
    pathway_adjustments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- =====================================================
-- 7. CERTIFICATES TABLE (Completion Certificates)
-- =====================================================
CREATE TABLE certificates (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    participant_name VARCHAR(255) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    issue_date DATE NOT NULL,
    certificate_type ENUM('completion', 'achievement', 'participation') NOT NULL,
    total_hours INT NOT NULL,
    cefr_level VARCHAR(10),
    grade VARCHAR(10),
    skills JSON,
    verification_code VARCHAR(255) NOT NULL,
    template ENUM('standard', 'premium', 'custom') DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- =====================================================
-- 8. FEEDBACK RESPONSES TABLE (User Feedback)
-- =====================================================
CREATE TABLE feedback_responses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    event_type ENUM('workshop', 'elearning', 'assessment', 'program') NOT NULL,
    submission_date DATE NOT NULL,
    responses JSON NOT NULL,
    overall_rating INT NOT NULL,
    comments TEXT,
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- =====================================================
-- 9. BRANDING SETTINGS TABLE (Portal Customization)
-- =====================================================
CREATE TABLE branding_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portal_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(7) NOT NULL,
    secondary_color VARCHAR(7) NOT NULL,
    accent_color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. RESOURCES TABLE (Learning Materials)
-- =====================================================
CREATE TABLE resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('document', 'video', 'audio', 'link', 'presentation', 'worksheet') NOT NULL,
    url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    tags JSON,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 11. PROGRESS TRACKING TABLE (Learning Progress)
-- =====================================================
CREATE TABLE progress_tracking (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    event_type ENUM('workshop', 'elearning', 'assessment', 'assignment') NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed', 'failed') DEFAULT 'not_started',
    score DECIMAL(5,2),
    time_spent_minutes INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    completion_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- =====================================================
-- 12. CURRICULUM TABLES (Grades, Subjects, Units, Lessons)
-- =====================================================
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    age_range VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    grade_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE SET NULL
);

CREATE TABLE units (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id VARCHAR(36) NOT NULL,
    order_number INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_id VARCHAR(36) NOT NULL,
    order_number INT DEFAULT 0,
    duration_minutes INT DEFAULT 45,
    objectives JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- =====================================================
-- 13. TEACHER NOMINATIONS TABLE (Teacher Management)
-- =====================================================
CREATE TABLE teacher_nominations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    school VARCHAR(255) NOT NULL,
    years_experience INT NOT NULL,
    qualifications JSON,
    subjects JSON,
    cefr_level VARCHAR(10),
    training_needs JSON,
    availability TEXT,
    nominated_by VARCHAR(36),
    nomination_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'enrolled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nominated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 14. PROGRAM ENROLLMENTS TABLE (Teacher Program Enrollment)
-- =====================================================
CREATE TABLE program_enrollments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    teacher_nomination_id VARCHAR(36) NOT NULL,
    pathway_id VARCHAR(36) NOT NULL,
    enrolled_by VARCHAR(36) NOT NULL,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_nomination_id) REFERENCES teacher_nominations(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (enrolled_by) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_pathways_status ON pathways(status);
CREATE INDEX idx_pathways_created_by ON pathways(created_by);
CREATE INDEX idx_learning_events_pathway ON learning_events(pathway_id);
CREATE INDEX idx_learning_events_type ON learning_events(type);
CREATE INDEX idx_workshops_pathway ON workshops(pathway_id);
CREATE INDEX idx_workshops_date ON workshops(workshop_date);
CREATE INDEX idx_workshops_facilitator ON workshops(facilitator_id);
CREATE INDEX idx_participants_user ON participants(user_id);
CREATE INDEX idx_participants_pathway ON participants(pathway_id);
CREATE INDEX idx_assessments_participant ON assessments(participant_id);
CREATE INDEX idx_certificates_participant ON certificates(participant_id);
CREATE INDEX idx_feedback_participant ON feedback_responses(participant_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_created_by ON resources(created_by);
CREATE INDEX idx_progress_participant ON progress_tracking(participant_id);
CREATE INDEX idx_progress_event ON progress_tracking(event_id);
CREATE INDEX idx_subjects_grade ON subjects(grade_id);
CREATE INDEX idx_units_subject ON units(subject_id);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_nominations_status ON teacher_nominations(status);
CREATE INDEX idx_enrollments_nomination ON program_enrollments(teacher_nomination_id);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Sample users
INSERT INTO users (id, email, name, password_hash, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@learningpathway.com', 'System Administrator', '$2b$10$hashedpassword', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@learningpathway.com', 'John Trainer', '$2b$10$hashedpassword', 'trainer'),
('550e8400-e29b-41d4-a716-446655440003', 'participant@learningpathway.com', 'Sarah Student', '$2b$10$hashedpassword', 'participant');

-- Sample pathways
INSERT INTO pathways (id, title, description, duration, total_hours, status, cefr_level, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Business English Fundamentals', 'Comprehensive business English course covering communication, writing, and presentation skills', 12, 120, 'active', 'B1', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Communication Skills', 'Advanced course focusing on professional communication and leadership', 8, 80, 'active', 'B2', '550e8400-e29b-41d4-a716-446655440001');

-- Sample grades
INSERT INTO grades (id, name, description, age_range) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Grade 1', 'First grade level', '6-7 years'),
('550e8400-e29b-41d4-a716-446655440061', 'Grade 2', 'Second grade level', '7-8 years'),
('550e8400-e29b-41d4-a716-446655440062', 'Grade 3', 'Third grade level', '8-9 years');

-- Sample subjects
INSERT INTO subjects (id, name, description, grade_id) VALUES
('550e8400-e29b-41d4-a716-446655440070', 'English Language Arts', 'Core English curriculum', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440071', 'Mathematics', 'Core math curriculum', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440072', 'Science', 'Core science curriculum', '550e8400-e29b-41d4-a716-446655440060');

-- Sample branding
INSERT INTO branding_settings (id, portal_name, primary_color, secondary_color, accent_color) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'Learning Pathway Portal', '#2563eb', '#1e40af', '#f59e0b');

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT '=== DATABASE SETUP COMPLETE ===' as status;
SELECT 'All tables created successfully!' as message;
SELECT 'Your application should now work perfectly!' as result;

-- Show all created tables
SHOW TABLES;

-- Show table counts
SELECT '=== TABLE COUNTS ===' as info;
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Pathways', COUNT(*) FROM pathways
UNION ALL
SELECT 'Grades', COUNT(*) FROM grades
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'Branding Settings', COUNT(*) FROM branding_settings;
