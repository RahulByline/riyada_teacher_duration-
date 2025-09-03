-- Complete MySQL Database Setup for Learning Pathway Application
-- Database: learning_db
-- User: root (no password)

-- Create database
CREATE DATABASE IF NOT EXISTS learning_db;
USE learning_db;

-- Users table
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

-- Pathways table
CREATE TABLE pathways (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    total_hours INT NOT NULL,
    status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
    cefr_level VARCHAR(10),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Learning events table
CREATE TABLE learning_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pathway_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('workshop', 'elearning', 'assessment', 'assignment', 'group', 'checkpoint') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    duration INT NOT NULL,
    format ENUM('online', 'offline', 'blended') NOT NULL,
    objectives JSON,
    resources JSON,
    dependencies JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE
);

-- Participants table
CREATE TABLE participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    pathway_id VARCHAR(36) NOT NULL,
    enrollment_date DATE NOT NULL,
    completion_date DATE,
    progress DECIMAL(5,2) DEFAULT 0.00,
    cefr_level_start VARCHAR(10),
    cefr_level_current VARCHAR(10),
    cefr_level_target VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, pathway_id)
);

-- Assessments table
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

-- Certificates table
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
    verification_code VARCHAR(255) UNIQUE NOT NULL,
    template ENUM('standard', 'premium', 'custom') DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Feedback responses table
CREATE TABLE feedback_responses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    event_type ENUM('workshop', 'elearning', 'assessment', 'program') NOT NULL,
    submission_date DATETIME NOT NULL,
    responses JSON NOT NULL,
    overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comments TEXT,
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Branding settings table
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

-- Workshops table (additional)
CREATE TABLE workshops (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pathway_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    facilitator_id VARCHAR(36),
    max_participants INT DEFAULT 20,
    workshop_date DATETIME NOT NULL,
    duration_hours INT NOT NULL,
    location VARCHAR(255),
    materials_required JSON,
    prerequisites JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (facilitator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Resources table (additional)
CREATE TABLE resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('document', 'video', 'audio', 'link', 'presentation') NOT NULL,
    url TEXT,
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    tags JSON,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Progress tracking table (additional)
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

-- Teacher nominations table
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
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nominated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Program enrollments table
CREATE TABLE program_enrollments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    teacher_nomination_id VARCHAR(36) NOT NULL,
    pathway_id VARCHAR(36) NOT NULL,
    enrolled_by VARCHAR(36),
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'completed', 'withdrawn') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_nomination_id) REFERENCES teacher_nominations(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (enrolled_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Curriculum tables
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    grade_order INT NOT NULL,
    color VARCHAR(7),
    min_score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE units (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subject_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_order INT NOT NULL,
    unit_order INT NOT NULL,
    duration_hours INT DEFAULT 1,
    objectives JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    unit_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_order INT NOT NULL,
    duration_minutes INT DEFAULT 45,
    content_type ENUM('video', 'text', 'interactive', 'quiz', 'assignment') DEFAULT 'text',
    content JSON,
    resources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_pathways_status ON pathways(status);
CREATE INDEX idx_pathways_created_by ON pathways(created_by);
CREATE INDEX idx_learning_events_pathway_id ON learning_events(pathway_id);
CREATE INDEX idx_learning_events_type ON learning_events(type);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_participants_pathway_id ON participants(pathway_id);
CREATE INDEX idx_assessments_participant_id ON assessments(participant_id);
CREATE INDEX idx_certificates_participant_id ON certificates(participant_id);
CREATE INDEX idx_feedback_participant_id ON feedback_responses(participant_id);
CREATE INDEX idx_feedback_event_id ON feedback_responses(event_id);
CREATE INDEX idx_workshops_pathway_id ON workshops(pathway_id);
CREATE INDEX idx_workshops_facilitator_id ON workshops(facilitator_id);
CREATE INDEX idx_resources_created_by ON resources(created_by);
CREATE INDEX idx_progress_participant_id ON progress_tracking(participant_id);
CREATE INDEX idx_progress_event_id ON progress_tracking(event_id);

-- Teacher nominations indexes
CREATE INDEX idx_teacher_nominations_email ON teacher_nominations(email);
CREATE INDEX idx_teacher_nominations_status ON teacher_nominations(status);
CREATE INDEX idx_teacher_nominations_nominated_by ON teacher_nominations(nominated_by);
CREATE INDEX idx_program_enrollments_nomination_id ON program_enrollments(teacher_nomination_id);
CREATE INDEX idx_program_enrollments_pathway_id ON program_enrollments(pathway_id);

-- Curriculum indexes
CREATE INDEX idx_grades_order ON grades(grade_order);
CREATE INDEX idx_subjects_name ON subjects(name);
CREATE INDEX idx_units_subject_id ON units(subject_id);
CREATE INDEX idx_units_grade_order ON units(grade_order);
CREATE INDEX idx_units_unit_order ON units(unit_order);
CREATE INDEX idx_lessons_unit_id ON lessons(unit_id);
CREATE INDEX idx_lessons_lesson_order ON lessons(lesson_order);

-- Insert sample data

-- Sample Users
INSERT INTO users (id, email, name, password_hash, role, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@learningpathway.com', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'admin', 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=A'),
('550e8400-e29b-41d4-a716-446655440002', 'trainer1@learningpathway.com', 'Sarah Johnson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'trainer', 'https://via.placeholder.com/150/10B981/FFFFFF?text=S'),
('550e8400-e29b-41d4-a716-446655440003', 'trainer2@learningpathway.com', 'Michael Chen', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'trainer', 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=M'),
('550e8400-e29b-41d4-a716-446655440004', 'participant1@learningpathway.com', 'Emma Wilson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'participant', 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=E'),
('550e8400-e29b-41d4-a716-446655440005', 'participant2@learningpathway.com', 'David Brown', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'participant', 'https://via.placeholder.com/150/EF4444/FFFFFF?text=D'),
('550e8400-e29b-41d4-a716-446655440006', 'client1@learningpathway.com', 'ABC Corporation', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', 'client', 'https://via.placeholder.com/150/6B7280/FFFFFF?text=ABC');

-- Sample Pathways
INSERT INTO pathways (id, title, description, duration, total_hours, status, cefr_level, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Business English Fundamentals', 'Comprehensive business English course covering communication, writing, and presentation skills', 12, 120, 'active', 'B1', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Communication Skills', 'Advanced level communication and public speaking course for professionals', 8, 80, 'active', 'C1', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'Technical Writing Mastery', 'Specialized course in technical documentation and technical writing', 6, 60, 'draft', 'B2', '550e8400-e29b-41d4-a716-446655440002');

-- Sample Learning Events
INSERT INTO learning_events (id, pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'Business Communication Basics', 'Introduction to professional business communication', 'workshop', '2024-02-01 09:00:00', '2024-02-01 17:00:00', 8, 'offline', '["Understand business communication principles", "Practice professional email writing", "Learn meeting etiquette"]', '["Business Communication Handbook", "Email Templates", "Meeting Guidelines"]', '[]'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', 'Email Writing Workshop', 'Professional email writing and etiquette', 'workshop', '2024-02-08 09:00:00', '2024-02-08 17:00:00', 8, 'blended', '["Master email structure", "Learn tone and formality", "Practice common scenarios"]', '["Email Templates", "Writing Guidelines", "Practice Exercises"]', '["550e8400-e29b-41d4-a716-446655440020"]'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440010', 'Business Writing Assessment', 'Assessment of business writing skills', 'assessment', '2024-02-15 10:00:00', '2024-02-15 12:00:00', 2, 'online', '["Evaluate writing skills", "Identify areas for improvement", "Provide feedback"]', '["Assessment Guidelines", "Writing Prompts"]', '["550e8400-e29b-41d4-a716-446655440020", "550e8400-e29b-41d4-a716-446655440021"]');

-- Sample Participants
INSERT INTO participants (id, user_id, pathway_id, enrollment_date, cefr_level_start, cefr_level_target) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15', 'A2', 'B1'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', '2024-01-20', 'B1', 'B2'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440011', '2024-01-25', 'B2', 'C1');

-- Sample Assessments
INSERT INTO assessments (id, participant_id, assessment_date, overall_level, skill_levels, recommendations, pathway_adjustments) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440030', '2024-01-15', 'A2', '{"listening": "A2", "reading": "A2", "speaking": "A1", "writing": "A2"}', '["Focus on speaking practice", "Increase vocabulary", "Practice listening comprehension"]', '["Add speaking exercises", "Include vocabulary building"]'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '2024-01-20', 'B1', '{"listening": "B1", "reading": "B2", "speaking": "B1", "writing": "B1"}', '["Maintain current level", "Focus on writing accuracy", "Practice advanced listening"]', '["Continue current pace", "Add writing workshops"]');

-- Sample Workshops
INSERT INTO workshops (id, pathway_id, title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', 'Business Communication Workshop', 'Interactive workshop on business communication skills', '550e8400-e29b-41d4-a716-446655440002', 15, '2024-02-01 09:00:00', 8, 'Conference Room A', '["Notebook", "Pen", "Business cards"]', '["Basic English knowledge", "Business background"]'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440010', 'Email Writing Masterclass', 'Advanced email writing techniques', '550e8400-e29b-41d4-a716-446655440003', 12, '2024-02-08 09:00:00', 6, 'Training Room B', '["Laptop", "Email templates", "Style guide"]', '["Business Communication Workshop"]');

-- Sample Resources
INSERT INTO resources (id, title, description, type, url, tags, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Business Communication Handbook', 'Comprehensive guide to business communication', 'document', 'https://example.com/handbook.pdf', '["communication", "business", "guide"]', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440061', 'Email Writing Video Series', 'Video tutorials on professional email writing', 'video', 'https://example.com/email-videos', '["email", "writing", "video"]', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440062', 'Business Vocabulary Audio', 'Audio lessons for business vocabulary', 'audio', 'https://example.com/vocabulary-audio', '["vocabulary", "audio", "business"]', '550e8400-e29b-41d4-a716-446655440002');

-- Sample Progress Tracking
INSERT INTO progress_tracking (id, participant_id, event_id, event_type, status, score, time_spent_minutes, last_accessed) VALUES
('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', 'workshop', 'completed', 85.5, 480, '2024-02-01 17:00:00'),
('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440021', 'workshop', 'in_progress', 60.0, 240, '2024-02-08 13:00:00'),
('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440020', 'workshop', 'completed', 92.0, 480, '2024-02-01 17:00:00');

-- Insert default branding settings
INSERT INTO branding_settings (portal_name, primary_color, secondary_color, accent_color) 
VALUES ('Learning Pathway Portal', '#3B82F6', '#1F2937', '#F59E0B');

-- Insert sample curriculum data
INSERT INTO grades (id, name, description, grade_order, color, min_score, max_score) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'Grade 1', 'First grade level', 1, '#3B82F6', 0.00, 59.99),
('550e8400-e29b-41d4-a716-446655440081', 'Grade 2', 'Second grade level', 2, '#10B981', 60.00, 69.99),
('550e8400-e29b-41d4-a716-446655440082', 'Grade 3', 'Third grade level', 3, '#F59E0B', 70.00, 79.99),
('550e8400-e29b-41d4-a716-446655440083', 'Grade 4', 'Fourth grade level', 4, '#EF4444', 80.00, 89.99),
('550e8400-e29b-41d4-a716-446655440084', 'Grade 5', 'Fifth grade level', 5, '#8B5CF6', 90.00, 100.00);

INSERT INTO subjects (id, name, description, color, icon) VALUES
('550e8400-e29b-41d4-a716-446655440090', 'Mathematics', 'Core mathematics curriculum', '#3B82F6', 'calculator'),
('550e8400-e29b-41d4-a716-446655440091', 'English', 'Language arts and literature', '#10B981', 'book-open'),
('550e8400-e29b-41d4-a716-446655440092', 'Science', 'Natural sciences and experiments', '#F59E0B', 'flask'),
('550e8400-e29b-41d4-a716-446655440093', 'Social Studies', 'History, geography, and civics', '#EF4444', 'globe');

INSERT INTO units (id, subject_id, name, description, grade_order, unit_order, duration_hours, objectives) VALUES
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440090', 'Basic Addition', 'Introduction to addition concepts', 1, 1, 2, '["Understand addition as combining groups", "Practice basic addition facts", "Solve word problems"]'),
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440090', 'Basic Subtraction', 'Introduction to subtraction concepts', 1, 2, 2, '["Understand subtraction as taking away", "Practice basic subtraction facts", "Solve word problems"]'),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440091', 'Phonics', 'Letter sounds and basic reading', 1, 1, 3, '["Learn letter sounds", "Practice blending sounds", "Read simple words"]');

-- Sample Teacher Nominations
INSERT INTO teacher_nominations (id, first_name, last_name, email, phone, position, department, school, years_experience, qualifications, subjects, cefr_level, training_needs, availability, nominated_by, nomination_date) VALUES
('550e8400-e29b-41d4-a716-446655440110', 'Maria', 'Garcia', 'maria.garcia@school.edu', '+1234567890', 'English Teacher', 'Language Arts', 'Central High School', 5, '["BA English", "MA Education", "TESOL Certificate"]', '["English", "Literature", "ESL"]', 'B2', '["Advanced grammar", "Literature analysis", "Student assessment"]', 'Weekdays after 3 PM', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440111', 'James', 'Wilson', 'james.wilson@school.edu', '+1234567891', 'Math Teacher', 'Mathematics', 'North Elementary', 8, '["BS Mathematics", "MS Education", "Math Specialist"]', '["Mathematics", "Algebra", "Geometry"]', 'C1', '["Problem-solving strategies", "Technology integration", "Differentiated instruction"]', 'Weekends and evenings', '550e8400-e29b-41d4-a716-446655440002', '2024-01-20');

-- Show all tables
SHOW TABLES;

-- Show sample data
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
