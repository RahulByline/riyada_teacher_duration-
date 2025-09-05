-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 04, 2025 at 08:44 AM
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
  `month_index` int DEFAULT '1' COMMENT 'Month position (1, 2, 3, etc.)',
  `week_index` int DEFAULT '1' COMMENT 'Week position within month (1, 2, 3, 4)',
  PRIMARY KEY (`id`),
  KEY `idx_learning_events_pathway` (`pathway_id`),
  KEY `idx_learning_events_type` (`type`),
  KEY `idx_learning_events_placement` (`pathway_id`,`month_index`,`week_index`)
) ;

--
-- Dumping data for table `learning_events`
--

INSERT INTO `learning_events` (`id`, `pathway_id`, `title`, `description`, `type`, `start_date`, `end_date`, `duration`, `format`, `objectives`, `resources`, `dependencies`, `created_at`, `updated_at`, `month_index`, `week_index`) VALUES
('60951ae4-758b-4d2f-a875-283f5d3ed1b7', '550e8400-e29b-41d4-a716-446655440011', 'fghfgh', 'gjgjh', 'elearning', '2025-09-03', '2025-09-03', 4, 'online', '[\"gjgjh\"]', '[]', '[]', '2025-09-03 13:36:12', '2025-09-03 13:36:12', 1, 1),
('97c2069f-09b1-46b7-a6f6-989391bfad04', '550e8400-e29b-41d4-a716-446655440011', 'sdas', 'fghgfh', 'elearning', '2025-09-03', '2025-09-03', 6, 'online', '[\"fghgfh\"]', '[]', '[]', '2025-09-03 13:36:03', '2025-09-03 13:36:03', 1, 1),
('9a19a02a-2f94-4b06-a313-ac36a2ea0e94', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 1', 'Event month 1 week 1', 'workshop', '2025-09-03', '2025-09-03', 2, 'online', '[\"Event month 1 week 1\"]', '[]', '[]', '2025-09-03 13:42:26', '2025-09-03 13:42:26', 1, 1),
('9eb3fede-12b5-4cc5-98b3-0960ee4f451d', '550e8400-e29b-41d4-a716-446655440010', 'E1', NULL, 'workshop', '2025-09-03', '2025-09-03', 3, 'online', '[]', '[]', '[]', '2025-09-03 13:30:34', '2025-09-03 13:30:34', 1, 1),
('a773c7b0-679e-474a-8218-4c00acb1c340', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 1 activity 2', 'Event month 1 week 1 activity 2', 'assignment', '2025-09-03', '2025-09-03', 2, 'online', '[\"Event month 1 week 1 activity 2\"]', '[]', '[]', '2025-09-03 13:42:55', '2025-09-03 13:42:55', 1, 1),
('cc73b670-1b38-402e-85b7-6df6f6e787ae', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 2', 'Event month 1 week 2', 'assessment', '2025-09-03', '2025-09-03', 4, 'online', '[\"Event month 1 week 2\"]', '[]', '[]', '2025-09-03 13:42:40', '2025-09-03 13:42:40', 1, 2),
('e3ba4aad-9114-41e2-802a-cc73c53749b7', '550e8400-e29b-41d4-a716-446655440011', 'gfhh', 'gfhfg', 'workshop', '2025-09-03', '2025-09-03', 4, 'online', '[\"gfhfg\"]', '[]', '[]', '2025-09-03 13:36:45', '2025-09-03 13:36:45', 1, 1),
('fffdec03-4267-4cde-80f6-c5280080cc2d', '550e8400-e29b-41d4-a716-446655440011', '434rfgddfg', 'nbv', 'elearning', '2025-09-03', '2025-09-03', 4, 'online', '[\"nbv\"]', '[]', '[]', '2025-09-03 13:36:27', '2025-09-03 13:36:27', 1, 1);

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
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Communication Skills', 'Advanced course focusing on professional communication and leadership', 8, 80, 'active', 'B2', '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 09:31:05', '2025-09-03 09:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `program_enrollments`
--

DROP TABLE IF EXISTS `program_enrollments`;
CREATE TABLE IF NOT EXISTS `program_enrollments` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `teacher_nomination_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `enrolled_by` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `enrollment_date` date DEFAULT NULL,
  `status` enum('active','completed','dropped') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL DEFAULT (uuid()),
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `type` enum('document','video','audio','link','presentation','worksheet','handbook','guide','form','elearning','template','assessment') COLLATE utf8mb4_general_ci NOT NULL,
  `format` enum('pdf','docx','pptx','mp4','avi','mov','zip','rar','link','other') COLLATE utf8mb4_general_ci DEFAULT 'pdf',
  `category` enum('trainer-resources','participant-materials','assessment-tools','templates','multimedia') COLLATE utf8mb4_general_ci DEFAULT 'trainer-resources',
  `url` text COLLATE utf8mb4_general_ci,
  `file_size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `is_public` tinyint(1) DEFAULT '0',
  `version` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '1.0',
  `program_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `month_number` int DEFAULT NULL,
  `component_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resources_type` (`type`),
  KEY `idx_resources_category` (`category`),
  KEY `idx_resources_program` (`program_id`),
  KEY `idx_resources_created_by` (`created_by`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `description`, `type`, `format`, `category`, `url`, `file_size`, `mime_type`, `tags`, `status`, `is_public`, `version`, `program_id`, `month_number`, `component_id`, `created_by`, `created_at`, `updated_at`) VALUES
('c44fccd2-88cc-11f0-ad62-d843ae497925', 'Teaching Fundamentals Guide', 'Comprehensive guide covering essential teaching methodologies and classroom management techniques', 'guide', 'pdf', 'trainer-resources', NULL, '2.5 MB', NULL, '[\"teaching\", \"fundamentals\", \"classroom\"]', 'published', 1, '1.0', NULL, NULL, NULL, NULL, '2025-09-03 13:49:09', '2025-09-03 13:49:09'),
('c44fd0aa-88cc-11f0-ad62-d843ae497925', 'CEFR Assessment Template', 'Standardized template for conducting CEFR level assessments', 'template', 'docx', 'assessment-tools', NULL, '1.8 MB', NULL, '[\"cefr\", \"assessment\", \"template\"]', 'published', 1, '1.0', NULL, NULL, NULL, NULL, '2025-09-03 13:49:09', '2025-09-03 13:49:09'),
('c44fd151-88cc-11f0-ad62-d843ae497925', 'Workshop Planning Checklist', 'Step-by-step checklist for planning and organizing workshops', 'template', 'pdf', 'templates', NULL, '0.5 MB', NULL, '[\"workshop\", \"planning\", \"checklist\"]', 'published', 1, '1.0', NULL, NULL, NULL, NULL, '2025-09-03 13:49:09', '2025-09-03 13:49:09');

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
  `qualifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `cefr_level` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `training_needs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
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
  `materials_required` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `prerequisites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
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
-- Dumping data for table `workshops`
--

INSERT INTO `workshops` (`id`, `pathway_id`, `title`, `description`, `facilitator_id`, `max_participants`, `workshop_date`, `duration_hours`, `location`, `materials_required`, `prerequisites`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
('615d3a38-88bf-11f0-ad62-d843ae497925', '550e8400-e29b-41d4-a716-446655440010', 'vxcv', NULL, NULL, 20, '2025-09-05', 4, NULL, '[]', '[]', 'draft', NULL, '2025-09-03 12:10:01', '2025-09-03 12:13:20'),
('c2458566-2b33-4cd1-a744-933aee7b2995', '550e8400-e29b-41d4-a716-446655440010', 'asdasd', NULL, NULL, 20, '2025-09-06', 8, 'Location', '[]', '[]', 'draft', NULL, '2025-09-03 12:14:04', '2025-09-03 12:14:04');

-- --------------------------------------------------------

--
-- Table structure for table `workshop_agenda`
--

DROP TABLE IF EXISTS `workshop_agenda`;
CREATE TABLE IF NOT EXISTS `workshop_agenda` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `workshop_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `activity_type` enum('session','presentation','break','activity','workshop','group_work','assessment','feedback') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'session',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration_minutes` int DEFAULT NULL,
  `facilitator_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `materials_needed` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_workshop_agenda_workshop` (`workshop_id`),
  KEY `idx_workshop_agenda_order` (`workshop_id`,`order_index`),
  KEY `idx_workshop_agenda_time` (`workshop_id`,`start_time`),
  KEY `idx_workshop_agenda_facilitator` (`facilitator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workshop_agenda`
--

INSERT INTO `workshop_agenda` (`id`, `workshop_id`, `title`, `description`, `activity_type`, `start_time`, `end_time`, `duration_minutes`, `facilitator_id`, `order_index`, `materials_needed`, `notes`, `created_at`, `updated_at`) VALUES
('09bb8273-7030-4ae4-82e7-64d975192894', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'test1', 'test1', 'assessment', '09:00:00', '09:30:00', NULL, NULL, 1, '\"\\\"[]\\\"\"', NULL, '2025-09-03 12:34:38', '2025-09-03 12:44:02'),
('1cac358a-87ea-4e01-b03c-83182dd014cd', '615d3a38-88bf-11f0-ad62-d843ae497925', 'xcvxcv', 'xvxcvxv', 'activity', '09:00:00', '09:30:00', NULL, NULL, 1, '[]', 'xvxvx', '2025-09-03 12:31:22', '2025-09-03 12:31:22'),
('22640648-0604-4671-bf32-cf07c0d22a89', '615d3a38-88bf-11f0-ad62-d843ae497925', 'title', 'title', 'session', '09:00:00', '09:30:00', NULL, NULL, 2, '[]', 'title', '2025-09-03 12:51:39', '2025-09-03 12:51:39'),
('580967f6-6566-46be-a3a9-5152698897eb', '615d3a38-88bf-11f0-ad62-d843ae497925', 'title', 'title', 'session', '09:00:00', '09:30:00', NULL, '945661e5-88b9-11f0-8dc0-d843aec570fe', 3, '[]', 'title', '2025-09-03 12:52:04', '2025-09-03 12:52:04'),
('ad2cda66-3ad4-4f7b-bd24-16378f178409', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'test2', 'desc', 'session', '09:30:00', '10:00:00', NULL, NULL, 2, '[]', 'dssdfds', '2025-09-03 12:38:59', '2025-09-03 12:44:02');

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

--
-- Constraints for table `workshop_agenda`
--
ALTER TABLE `workshop_agenda`
  ADD CONSTRAINT `fk_workshop_agenda_facilitator` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_workshop_agenda_workshop` FOREIGN KEY (`workshop_id`) REFERENCES `workshops` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
