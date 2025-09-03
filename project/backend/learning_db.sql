-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 03, 2025 at 12:05 PM
-- Server version: 9.1.0
-- PHP Version: 8.1.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `learning_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

DROP TABLE IF EXISTS `assessments`;
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `participant_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `assessment_date` date NOT NULL,
  `overall_level` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `skill_levels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `recommendations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `pathway_adjustments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assessments_participant` (`participant_id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `branding_settings`
--

DROP TABLE IF EXISTS `branding_settings`;
CREATE TABLE IF NOT EXISTS `branding_settings` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `portal_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `logo_url` text COLLATE utf8mb4_general_ci,
  `primary_color` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `secondary_color` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `accent_color` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branding_settings`
--

INSERT INTO `branding_settings` (`id`, `portal_name`, `logo_url`, `primary_color`, `secondary_color`, `accent_color`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'Learning Pathway Portal', NULL, '#2563eb', '#1e40af', '#f59e0b', '2025-09-03 09:31:05', '2025-09-03 09:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `participant_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `participant_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `program_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `completion_date` date NOT NULL,
  `issue_date` date NOT NULL,
  `certificate_type` enum('completion','achievement','participation') COLLATE utf8mb4_general_ci NOT NULL,
  `total_hours` int NOT NULL,
  `cefr_level` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `grade` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `verification_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `template` enum('standard','premium','custom') COLLATE utf8mb4_general_ci DEFAULT 'standard',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_certificates_participant` (`participant_id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_responses`
--

DROP TABLE IF EXISTS `feedback_responses`;
CREATE TABLE IF NOT EXISTS `feedback_responses` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `participant_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `event_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `event_type` enum('workshop','elearning','assessment','program') COLLATE utf8mb4_general_ci NOT NULL,
  `submission_date` date NOT NULL,
  `responses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `overall_rating` int NOT NULL,
  `comments` text COLLATE utf8mb4_general_ci,
  `anonymous` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_feedback_participant` (`participant_id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
CREATE TABLE IF NOT EXISTS `grades` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `age_range` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `name`, `description`, `age_range`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Grade 1', 'First grade level', '6-7 years', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440061', 'Grade 2', 'Second grade level', '7-8 years', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440062', 'Grade 3', 'Third grade level', '8-9 years', '2025-09-03 09:31:05', '2025-09-03 09:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `learning_events`
--

DROP TABLE IF EXISTS `learning_events`;
CREATE TABLE IF NOT EXISTS `learning_events` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `type` enum('workshop','elearning','assessment','assignment','group','checkpoint') COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration` int DEFAULT '0',
  `format` enum('online','offline','blended') COLLATE utf8mb4_general_ci DEFAULT 'online',
  `objectives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `resources` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `dependencies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_learning_events_pathway` (`pathway_id`),
  KEY `idx_learning_events_type` (`type`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `unit_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `order_number` int DEFAULT '0',
  `duration_minutes` int DEFAULT '45',
  `objectives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lessons_unit` (`unit_id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE IF NOT EXISTS `participants` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `enrollment_date` date NOT NULL,
  `completion_date` date DEFAULT NULL,
  `progress` int DEFAULT '0',
  `cefr_level_start` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cefr_level_current` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cefr_level_target` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_participants_user` (`user_id`),
  KEY `idx_participants_pathway` (`pathway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pathways`
--

DROP TABLE IF EXISTS `pathways`;
CREATE TABLE IF NOT EXISTS `pathways` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `duration` int DEFAULT '0',
  `total_hours` int DEFAULT '0',
  `status` enum('draft','active','completed') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `cefr_level` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pathways_status` (`status`),
  KEY `idx_pathways_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pathways`
--

INSERT INTO `pathways` (`id`, `title`, `description`, `duration`, `total_hours`, `status`, `cefr_level`, `created_by`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Business English Fundamentals', 'Comprehensive business English course covering communication, writing, and presentation skills', 12, 120, 'active', 'B1', '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Communication Skills', 'Advanced course focusing on professional communication and leadership', 8, 80, 'active', 'B2', '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('cb9a90a8-88b8-11f0-8dc0-d843aec570fe', 'test ', 'Test', 6, 120, 'draft', NULL, '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 11:25:59', '2025-09-03 11:25:59');

-- --------------------------------------------------------

--
-- Table structure for table `program_enrollments`
--

DROP TABLE IF EXISTS `program_enrollments`;
CREATE TABLE IF NOT EXISTS `program_enrollments` (
  `id` varchar(36) NOT NULL,
  `teacher_nomination_id` varchar(36) NOT NULL,
  `pathway_id` varchar(36) NOT NULL,
  `enrolled_by` varchar(36) NOT NULL,
  `enrollment_date` date DEFAULT NULL,
  `status` enum('active','completed','dropped') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `progress_tracking`
--

DROP TABLE IF EXISTS `progress_tracking`;
CREATE TABLE IF NOT EXISTS `progress_tracking` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `participant_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `event_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `event_type` enum('workshop','elearning','assessment','assignment') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('not_started','in_progress','completed','failed') COLLATE utf8mb4_general_ci DEFAULT 'not_started',
  `score` decimal(5,2) DEFAULT NULL,
  `time_spent_minutes` int DEFAULT '0',
  `last_accessed` timestamp NULL DEFAULT NULL,
  `completion_date` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_progress_participant` (`participant_id`),
  KEY `idx_progress_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
CREATE TABLE IF NOT EXISTS `resources` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `type` enum('document','video','audio','link','presentation','worksheet') COLLATE utf8mb4_general_ci NOT NULL,
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `file_size` bigint DEFAULT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_by` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resources_type` (`type`),
  KEY `idx_resources_created_by` (`created_by`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `grade_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subjects_grade` (`grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `description`, `grade_id`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440070', 'English Language Arts', 'Core English curriculum', '550e8400-e29b-41d4-a716-446655440060', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440071', 'Mathematics', 'Core math curriculum', '550e8400-e29b-41d4-a716-446655440060', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440072', 'Science', 'Core science curriculum', '550e8400-e29b-41d4-a716-446655440060', '2025-09-03 09:31:05', '2025-09-03 09:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_nominations`
--

DROP TABLE IF EXISTS `teacher_nominations`;
CREATE TABLE IF NOT EXISTS `teacher_nominations` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `years_experience` int NOT NULL,
  `qualifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `cefr_level` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `training_needs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `availability` text COLLATE utf8mb4_general_ci,
  `nominated_by` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nomination_date` date NOT NULL,
  `status` enum('pending','approved','rejected','enrolled','completed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nominated_by` (`nominated_by`),
  KEY `idx_nominations_status` (`status`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE IF NOT EXISTS `units` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `subject_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `order_number` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_units_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','trainer','participant','client') COLLATE utf8mb4_general_ci NOT NULL,
  `avatar_url` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password_hash`, `role`, `avatar_url`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@learningpathway.com', 'System Administrator', '$2b$10$hashedpassword', 'admin', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@learningpathway.com', 'John Trainer', '$2b$10$hashedpassword', 'trainer', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440003', 'participant@learningpathway.com', 'Sarah Student', '$2b$10$hashedpassword', 'participant', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('945661e5-88b9-11f0-8dc0-d843aec570fe', 'admin@system.local', 'System Administrator', 'passcode-auth', 'admin', NULL, '2025-09-03 11:31:36', '2025-09-03 11:31:36');

-- --------------------------------------------------------

--
-- Table structure for table `workshops`
--

DROP TABLE IF EXISTS `workshops`;
CREATE TABLE IF NOT EXISTS `workshops` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `facilitator_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `max_participants` int DEFAULT '20',
  `workshop_date` date NOT NULL,
  `duration_hours` int NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `materials_required` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `prerequisites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `status` enum('draft','planning','ready','in-progress','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `created_by` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_workshops_pathway` (`pathway_id`),
  KEY `idx_workshops_date` (`workshop_date`),
  KEY `idx_workshops_facilitator` (`facilitator_id`)
) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_responses`
--
ALTER TABLE `feedback_responses`
  ADD CONSTRAINT `feedback_responses_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `learning_events`
--
ALTER TABLE `learning_events`
  ADD CONSTRAINT `learning_events_ibfk_1` FOREIGN KEY (`pathway_id`) REFERENCES `pathways` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
