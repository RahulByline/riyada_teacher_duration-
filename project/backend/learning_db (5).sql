-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 05, 2025 at 09:15 AM
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
('2e674fe9-a662-43a4-a9e0-a82c894b65be', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'dsfsf', 'dsgdf', 'group', '2025-09-04', '2025-09-04', 3, 'online', '[\"dsgdf\"]', '[]', '[]', '2025-09-04 09:50:47', '2025-09-04 09:50:47', 5, 2),
('60951ae4-758b-4d2f-a875-283f5d3ed1b7', '550e8400-e29b-41d4-a716-446655440011', 'fghfgh', 'gjgjh', 'elearning', '2025-09-03', '2025-09-03', 4, 'online', '[\"gjgjh\"]', '[]', '[]', '2025-09-03 13:36:12', '2025-09-03 13:36:12', 1, 1),
('65ad856c-a6f5-43be-b16d-5ba6b06242af', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'zXZx', 'asdasd', 'elearning', '2025-09-04', '2025-09-04', 2, 'online', '[\"asdasd\"]', '[]', '[]', '2025-09-04 09:41:05', '2025-09-04 09:41:05', 3, 2),
('6b98cf23-260c-497d-a6bb-1b3d53b77673', '41ab6034-12d5-4c43-ab59-add8ddf28007', '12', 'dfdsf', 'assessment', '2025-09-04', '2025-09-04', 2, 'online', '[\"dfdsf\"]', '[]', '[]', '2025-09-04 09:41:14', '2025-09-04 09:41:14', 4, 4),
('97c2069f-09b1-46b7-a6f6-989391bfad04', '550e8400-e29b-41d4-a716-446655440011', 'sdas', 'fghgfh', 'elearning', '2025-09-03', '2025-09-03', 6, 'online', '[\"fghgfh\"]', '[]', '[]', '2025-09-03 13:36:03', '2025-09-03 13:36:03', 1, 1),
('9a19a02a-2f94-4b06-a313-ac36a2ea0e94', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 1', 'Event month 1 week 1', 'workshop', '2025-09-03', '2025-09-03', 2, 'online', '[\"Event month 1 week 1\"]', '[]', '[]', '2025-09-03 13:42:26', '2025-09-03 13:42:26', 1, 1),
('9eb3fede-12b5-4cc5-98b3-0960ee4f451d', '550e8400-e29b-41d4-a716-446655440010', 'E1', NULL, 'workshop', '2025-09-03', '2025-09-03', 3, 'online', '[]', '[]', '[]', '2025-09-03 13:30:34', '2025-09-03 13:30:34', 1, 1),
('a0ff0ffe-81bc-44e1-ad53-668d273a0573', '550e8400-e29b-41d4-a716-446655440010', 'Test', 'Test', 'workshop', '2025-09-04', '2025-09-04', 2, 'online', '[\"Test\"]', '[]', '[]', '2025-09-04 09:24:00', '2025-09-04 09:24:00', 1, 1),
('a773c7b0-679e-474a-8218-4c00acb1c340', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 1 activity 2', 'Event month 1 week 1 activity 2', 'assignment', '2025-09-03', '2025-09-03', 2, 'online', '[\"Event month 1 week 1 activity 2\"]', '[]', '[]', '2025-09-03 13:42:55', '2025-09-03 13:42:55', 1, 1),
('b13c4d06-ed56-4a7a-b039-ab5afa837be0', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'ffgh', 'gfgh', 'assessment', '2025-09-04', '2025-09-04', 4, 'online', '[\"gfgh\"]', '[]', '[]', '2025-09-04 09:41:25', '2025-09-04 09:41:25', 4, 2),
('cc3d0fb7-21df-4ed6-848d-040c1e7177af', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'Initial Workshop', 'Initial Workshop', 'workshop', '2025-09-04', '2025-09-04', 3, 'online', '[\"Initial Workshop\"]', '[]', '[]', '2025-09-04 12:15:31', '2025-09-04 12:15:31', 1, 1),
('cc73b670-1b38-402e-85b7-6df6f6e787ae', '550e8400-e29b-41d4-a716-446655440011', 'Event month 1 week 2', 'Event month 1 week 2', 'assessment', '2025-09-03', '2025-09-03', 4, 'online', '[\"Event month 1 week 2\"]', '[]', '[]', '2025-09-03 13:42:40', '2025-09-03 13:42:40', 1, 2),
('d3f3d68e-4cd6-46a8-9abb-7eb987248126', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'xcvxcv', 'gfdgfd', 'workshop', '2025-09-04', '2025-09-04', 3, 'online', '[\"gfdgfd\"]', '[]', '[]', '2025-09-04 09:39:47', '2025-09-04 09:39:47', 2, 2),
('d44821e7-1109-420b-9dd5-eaeb5148c833', '550e8400-e29b-41d4-a716-446655440010', 'ds', 'ddsaa', 'elearning', '2025-09-04', '2025-09-04', 1, 'online', '[\"ddsaa\"]', '[]', '[]', '2025-09-04 09:24:14', '2025-09-04 09:24:14', 1, 1),
('d8b6e29e-9ae1-4f7f-9fb9-0edb1ae0807b', '41ab6034-12d5-4c43-ab59-add8ddf28007', '3', 'fdgdfg', 'elearning', '2025-09-04', '2025-09-04', 2, 'online', '[\"fdgdfg\"]', '[]', '[]', '2025-09-04 09:39:55', '2025-09-04 09:39:55', 2, 3),
('e3ba4aad-9114-41e2-802a-cc73c53749b7', '550e8400-e29b-41d4-a716-446655440011', 'gfhh', 'gfhfg', 'workshop', '2025-09-03', '2025-09-03', 4, 'online', '[\"gfhfg\"]', '[]', '[]', '2025-09-03 13:36:45', '2025-09-03 13:36:45', 1, 1),
('ef80377b-8605-43fd-9d12-db8ae4ebf513', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'sdffs', '54532', 'elearning', '2025-09-04', '2025-09-04', 2, 'online', '[\"54532\"]', '[]', '[]', '2025-09-04 09:38:00', '2025-09-04 09:38:00', 1, 1),
('fa7eaa96-4f72-46b3-ab7d-7186f6164b49', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'dsfdfsdfg', 'ghdfj', 'checkpoint', '2025-09-04', '2025-09-04', 8, 'online', '[\"ghdfj\"]', '[]', '[]', '2025-09-04 09:51:42', '2025-09-04 09:51:42', 6, 3),
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
('41ab6034-12d5-4c43-ab59-add8ddf28007', 'Test', 'Test', 6, 120, 'active', NULL, '550e8400-e29b-41d4-a716-446655440001', '2025-09-04 09:37:27', '2025-09-04 12:08:47'),
('550e8400-e29b-41d4-a716-446655440010', 'Business English Fundamentals', 'Comprehensive business English course covering communication, writing, and presentation skills', 12, 120, 'active', 'B1', '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440011', 'Advanced Communication Skills', 'Advanced course focusing on professional communication and leadership', 8, 80, 'active', 'B2', '550e8400-e29b-41d4-a716-446655440001', '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('73802c6e-8b34-4149-ae01-b71d9522126b', 'New Pathway', 'New Pathway', 6, 120, 'draft', 'B2', '550e8400-e29b-41d4-a716-446655440001', '2025-09-05 06:20:28', '2025-09-05 06:20:28');

-- --------------------------------------------------------

--
-- Table structure for table `pathway_participants`
--

DROP TABLE IF EXISTS `pathway_participants`;
CREATE TABLE IF NOT EXISTS `pathway_participants` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `teacher_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `enrollment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('enrolled','active','completed','dropped') COLLATE utf8mb4_general_ci DEFAULT 'enrolled',
  `completion_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pathway_teacher` (`pathway_id`,`teacher_id`),
  KEY `idx_pathway_participants_pathway` (`pathway_id`),
  KEY `idx_pathway_participants_teacher` (`teacher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pathway_participants`
--

INSERT INTO `pathway_participants` (`id`, `pathway_id`, `teacher_id`, `enrollment_date`, `status`, `completion_date`, `created_at`, `updated_at`) VALUES
('d46172fb-fe7f-42ef-b982-eaa38b45a3cf', '73802c6e-8b34-4149-ae01-b71d9522126b', 'c9870f12-fd5c-4c6e-acfc-235e41bc01fa', '2025-09-05 06:20:28', 'enrolled', NULL, '2025-09-05 06:20:28', '2025-09-05 06:20:28'),
('0921c6a4-ee6d-4232-8bec-79a8ba126a30', '73802c6e-8b34-4149-ae01-b71d9522126b', '1253a341-acd5-400d-81cc-990dc6bfb6a1', '2025-09-05 06:20:28', 'enrolled', NULL, '2025-09-05 06:20:28', '2025-09-05 06:20:28'),
('a9101c6f-57fe-4803-962b-5fa92cbbe1aa', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'c9870f12-fd5c-4c6e-acfc-235e41bc01fa', '2025-09-05 06:29:47', 'enrolled', NULL, '2025-09-05 06:29:47', '2025-09-05 06:29:47'),
('8b3e3a2a-2de3-486f-aa2f-dee6324aac63', '550e8400-e29b-41d4-a716-446655440010', '1253a341-acd5-400d-81cc-990dc6bfb6a1', '2025-09-05 08:55:55', 'enrolled', NULL, '2025-09-05 08:55:55', '2025-09-05 08:55:55'),
('c6e5e761-b7f7-46f1-b476-c43dfe74da14', '550e8400-e29b-41d4-a716-446655440010', 'c9870f12-fd5c-4c6e-acfc-235e41bc01fa', '2025-09-05 08:55:55', 'enrolled', NULL, '2025-09-05 08:55:55', '2025-09-05 08:55:55'),
('2d690cde-33ef-4d21-81e0-64b826575ec4', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', '2025-09-05 08:55:55', 'enrolled', NULL, '2025-09-05 08:55:55', '2025-09-05 08:55:55'),
('fa5df66a-4fd0-4feb-bc9b-a3c331ae2862', '550e8400-e29b-41d4-a716-446655440010', '', '2025-09-05 08:55:55', 'enrolled', NULL, '2025-09-05 08:55:55', '2025-09-05 08:55:55'),
('cb948154-3b91-4e98-99c5-494bf3146087', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2025-09-05 08:55:55', 'enrolled', NULL, '2025-09-05 08:55:55', '2025-09-05 08:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `pathway_trainers`
--

DROP TABLE IF EXISTS `pathway_trainers`;
CREATE TABLE IF NOT EXISTS `pathway_trainers` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pathway_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `trainer_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('lead_trainer','assistant_trainer','guest_trainer') COLLATE utf8mb4_general_ci DEFAULT 'assistant_trainer',
  `assigned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pathway_trainer` (`pathway_id`,`trainer_id`),
  KEY `idx_pathway_trainers_pathway` (`pathway_id`),
  KEY `idx_pathway_trainers_trainer` (`trainer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pathway_trainers`
--

INSERT INTO `pathway_trainers` (`id`, `pathway_id`, `trainer_id`, `role`, `assigned_date`, `status`, `created_at`, `updated_at`) VALUES
('f00edd82-39c7-4158-b631-8bab65ad969f', '73802c6e-8b34-4149-ae01-b71d9522126b', '550e8400-e29b-41d4-a716-446655440002', 'lead_trainer', '2025-09-05 06:20:28', 'active', '2025-09-05 06:20:28', '2025-09-05 06:20:28'),
('a8cb6646-2e05-4180-a405-39a3ca08d83d', '73802c6e-8b34-4149-ae01-b71d9522126b', '550e8400-e29b-41d4-a716-446655440854', 'lead_trainer', '2025-09-05 06:20:28', 'active', '2025-09-05 06:20:28', '2025-09-05 06:20:28');

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
  `workshop_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `agenda_item_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `learning_event_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `assigned_to_user_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resource_context` enum('pathway','workshop','agenda_item','learning_event','user_specific','general') COLLATE utf8mb4_general_ci DEFAULT 'general',
  PRIMARY KEY (`id`),
  KEY `idx_resources_type` (`type`),
  KEY `idx_resources_category` (`category`),
  KEY `idx_resources_program` (`program_id`),
  KEY `idx_resources_created_by` (`created_by`),
  KEY `idx_resources_workshop` (`workshop_id`),
  KEY `idx_resources_learning_event` (`learning_event_id`),
  KEY `idx_resources_user` (`assigned_to_user_id`),
  KEY `idx_resources_context` (`resource_context`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `description`, `type`, `format`, `category`, `url`, `file_size`, `mime_type`, `tags`, `status`, `is_public`, `version`, `program_id`, `month_number`, `component_id`, `created_by`, `created_at`, `updated_at`, `workshop_id`, `agenda_item_id`, `learning_event_id`, `assigned_to_user_id`, `resource_context`) VALUES
('b4c924a7-fc86-40f0-a66b-0a246dba7a60', 'test', 'test', 'presentation', 'pptx', 'participant-materials', '/uploads/resources/file-1756982427106-197082878.pptx', '36.45 MB', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '[\"abc\", \"def\", \"ghi\"]', 'draft', 0, '1.0', '41ab6034-12d5-4c43-ab59-add8ddf28007', 1, 'orientation', NULL, '2025-09-04 10:40:27', '2025-09-04 10:40:27', NULL, NULL, NULL, NULL, 'general'),
('a016c816-14ef-4a8c-90ea-eec7fea5eeca', 'New resource', 'New resource', 'document', 'pdf', 'trainer-resources', '/uploads/resources/file-1756976644146-439633861.pdf', '0.18 MB', 'application/pdf', '[]', 'draft', 0, '1.0', '171ad969-5f75-4345-b017-f53db13a8b7a', 1, 'orientation', NULL, '2025-09-04 09:04:05', '2025-09-04 10:56:32', NULL, NULL, NULL, NULL, 'general');

-- --------------------------------------------------------

--
-- Table structure for table `resource_agenda_items`
--

DROP TABLE IF EXISTS `resource_agenda_items`;
CREATE TABLE IF NOT EXISTS `resource_agenda_items` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `agenda_item_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_type` enum('required','optional','reference','handout') COLLATE utf8mb4_general_ci DEFAULT 'optional',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_resource_agenda` (`resource_id`,`agenda_item_id`),
  KEY `idx_resource_agenda_items_resource` (`resource_id`),
  KEY `idx_resource_agenda_items_agenda` (`agenda_item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_agenda_items`
--

INSERT INTO `resource_agenda_items` (`id`, `resource_id`, `agenda_item_id`, `resource_type`, `display_order`, `created_at`, `updated_at`) VALUES
('5b4751ee-4a0c-44b3-be01-61529b97e0a9', 'a016c816-14ef-4a8c-90ea-eec7fea5eeca', '09bb8273-7030-4ae4-82e7-64d975192894', 'optional', 0, '2025-09-05 07:38:02', '2025-09-05 07:38:02'),
('6b427900-e2ea-48c4-88e6-90d67efed9a5', 'b4c924a7-fc86-40f0-a66b-0a246dba7a60', '09bb8273-7030-4ae4-82e7-64d975192894', 'required', 0, '2025-09-05 07:41:37', '2025-09-05 07:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `resource_assignments`
--

DROP TABLE IF EXISTS `resource_assignments`;
CREATE TABLE IF NOT EXISTS `resource_assignments` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `assignment_type` enum('required','optional','reference','homework') COLLATE utf8mb4_general_ci DEFAULT 'optional',
  `due_date` date DEFAULT NULL,
  `assigned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completion_status` enum('not_started','in_progress','completed','overdue') COLLATE utf8mb4_general_ci DEFAULT 'not_started',
  `completion_date` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_resource_user` (`resource_id`,`user_id`),
  KEY `idx_resource_assignments_resource` (`resource_id`),
  KEY `idx_resource_assignments_user` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resource_learning_events`
--

DROP TABLE IF EXISTS `resource_learning_events`;
CREATE TABLE IF NOT EXISTS `resource_learning_events` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `learning_event_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_type` enum('required','optional','reference','handout') COLLATE utf8mb4_general_ci DEFAULT 'optional',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_resource_learning_event` (`resource_id`,`learning_event_id`),
  KEY `idx_resource_learning_events_resource` (`resource_id`),
  KEY `idx_resource_learning_events_event` (`learning_event_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resource_workshops`
--

DROP TABLE IF EXISTS `resource_workshops`;
CREATE TABLE IF NOT EXISTS `resource_workshops` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `workshop_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `resource_type` enum('required','optional','reference','handout') COLLATE utf8mb4_general_ci DEFAULT 'optional',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_resource_workshop` (`resource_id`,`workshop_id`),
  KEY `idx_resource_workshops_resource` (`resource_id`),
  KEY `idx_resource_workshops_workshop` (`workshop_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_workshops`
--

INSERT INTO `resource_workshops` (`id`, `resource_id`, `workshop_id`, `resource_type`, `display_order`, `created_at`, `updated_at`) VALUES
('77df5afe-c7b7-40af-a17d-9538a7bf67bd', 'b4c924a7-fc86-40f0-a66b-0a246dba7a60', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'required', 0, '2025-09-05 07:32:54', '2025-09-05 07:32:54');

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
  `role` enum('admin','trainer','teacher','participant','client') COLLATE utf8mb4_general_ci DEFAULT NULL,
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
('', 'user@system.local', 'Default User', 'passcode-auth', 'participant', NULL, '2025-09-05 08:22:14', '2025-09-05 08:22:14'),
('1253a341-acd5-400d-81cc-990dc6bfb6a1', 'new.test@bylinelearning.com', 'New Test', '$2a$10$QuM.j64jMYlBMBetPq6qUunO4kfyK4PEhj6sv0ZM9D7tHEQem0sp6', 'teacher', NULL, '2025-09-05 05:52:45', '2025-09-05 06:12:42'),
('44776b68-9cc4-4f56-bb70-f245d03e8c2e', 'zaki@bylinelearning.com', 'Zaki Shaikh', '$2a$10$cT2Mb9hJfnok2L.BtJrrN.nxaZOLczXb7dTY4Q8JJmh01QDZWJ.lS', 'trainer', NULL, '2025-09-04 14:05:46', '2025-09-04 14:05:46'),
('550e8400-e29b-41d4-a716-446655440001', 'admin@learningpathway.com', 'System Administrator', '$2b$10$hashedpassword', 'admin', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@learningpathway.com', 'John Trainer', '$2b$10$hashedpassword', 'trainer', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440003', 'participant@learningpathway.com', 'Sarah Student', '$2b$10$hashedpassword', 'participant', NULL, '2025-09-03 09:31:05', '2025-09-03 09:31:05'),
('550e8400-e29b-41d4-a716-446655440004', 'participant@system.local', 'Course Participant', 'passcode-auth', 'participant', NULL, '2025-09-04 09:32:30', '2025-09-04 09:58:30'),
('550e8400-e29b-41d4-a716-446655440854', 'trainer@system.local', 'Training Facilitator', 'passcode-auth', 'trainer', NULL, '2025-09-04 09:59:29', '2025-09-04 10:00:08'),
('550e8400-e29b-41d4-a716-446655440894', 'client@system.local', 'Client User', 'passcode-auth', 'client', NULL, '2025-09-04 10:00:50', '2025-09-04 10:01:18'),
('945661e5-88b9-11f0-8dc0-d843aec570fe', 'admin@system.local', 'System Administrator', 'passcode-auth', 'admin', NULL, '2025-09-03 11:31:36', '2025-09-03 11:31:36'),
('c9870f12-fd5c-4c6e-acfc-235e41bc01fa', 'test@bylinelearning.com', 'Test', '$2a$10$yZvuVxICkBFEoSCx7Xcp4uMN4Og6LfFgP2JbXE8/pWiTKVFzY0yHu', 'teacher', NULL, '2025-09-05 05:52:02', '2025-09-05 06:03:05');

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
('13045720-c16c-4685-b0c7-862462359297', '41ab6034-12d5-4c43-ab59-add8ddf28007', 'Initial Workshop', 'Initial Workshop', NULL, 20, '2025-09-03', 3, 'Online', '[]', '[]', 'draft', NULL, '2025-09-04 12:15:32', '2025-09-04 12:15:32'),
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
('09bb8273-7030-4ae4-82e7-64d975192894', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'test1', 'test1', 'assessment', '09:00:00', '09:30:00', NULL, NULL, 1, '\"\\\"[]\\\"\"', NULL, '2025-09-03 12:34:38', '2025-09-05 07:38:13'),
('170801ad-545d-4cf4-a8ca-e627b15f007e', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'Tea Break', 'Tea', 'break', '10:00:00', '10:15:00', NULL, NULL, 3, '\"[]\"', NULL, '2025-09-05 07:44:26', '2025-09-05 07:44:54'),
('82617268-7efb-4d71-930b-588aefa22643', '13045720-c16c-4685-b0c7-862462359297', 'Introduction ', 'Introduction ', 'session', '09:00:00', '09:30:00', NULL, '550e8400-e29b-41d4-a716-446655440894', 1, '[]', 'Notes', '2025-09-04 12:16:10', '2025-09-04 12:16:10'),
('ad2cda66-3ad4-4f7b-bd24-16378f178409', 'c2458566-2b33-4cd1-a744-933aee7b2995', 'test2', 'desc', 'session', '09:30:00', '10:00:00', NULL, NULL, 2, '[]', 'dssdfds', '2025-09-03 12:38:59', '2025-09-05 07:38:13');

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
