-- Fix Database Tables - Proper Structure
-- Run this to fix any table structure issues

USE learning_db;

-- Drop problematic tables if they exist (this will remove any data)
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS progress_tracking;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS teacher_nominations;
DROP TABLE IF EXISTS program_enrollments;

-- Recreate tables with proper structure

-- Create grades table
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    age_range VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subjects table with proper grade_id column
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    grade_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE SET NULL
);

-- Create units table
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

-- Create lessons table
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

-- Create workshops table
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

-- Create resources table
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

-- Create progress_tracking table
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

-- Create teacher nominations table
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

-- Create program enrollments table
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

-- Create indexes for better performance
CREATE INDEX idx_workshops_pathway ON workshops(pathway_id);
CREATE INDEX idx_workshops_date ON workshops(workshop_date);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_progress_participant ON progress_tracking(participant_id);
CREATE INDEX idx_progress_event ON progress_tracking(event_id);
CREATE INDEX idx_subjects_grade ON subjects(grade_id);
CREATE INDEX idx_units_subject ON units(subject_id);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_nominations_status ON teacher_nominations(status);
CREATE INDEX idx_enrollments_nomination ON program_enrollments(teacher_nomination_id);

-- Insert sample data
INSERT INTO grades (id, name, description, age_range) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Grade 1', 'First grade level', '6-7 years'),
('550e8400-e29b-41d4-a716-446655440061', 'Grade 2', 'Second grade level', '7-8 years'),
('550e8400-e29b-41d4-a716-446655440062', 'Grade 3', 'Third grade level', '8-9 years');

INSERT INTO subjects (id, name, description, grade_id) VALUES
('550e8400-e29b-41d4-a716-446655440070', 'English Language Arts', 'Core English curriculum', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440071', 'Mathematics', 'Core math curriculum', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440072', 'Science', 'Core science curriculum', '550e8400-e29b-41d4-a716-446655440060');

-- Verify tables were created correctly
SELECT 'Tables fixed successfully!' as status;
SHOW TABLES;

-- Show the structure of key tables
DESCRIBE subjects;
DESCRIBE workshops;
DESCRIBE resources;
