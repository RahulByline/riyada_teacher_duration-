-- Create workshop_agenda table for managing workshop schedule items
-- This table will store individual agenda items like sessions, breaks, activities, etc.

CREATE TABLE IF NOT EXISTS `workshop_agenda` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `workshop_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `activity_type` enum('session','presentation','break','activity','workshop','group_work','assessment','feedback') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'session',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration_minutes` int DEFAULT NULL,
  `facilitator_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_index` int DEFAULT 0,
  `materials_needed` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_workshop_agenda_workshop` (`workshop_id`),
  KEY `idx_workshop_agenda_order` (`workshop_id`, `order_index`),
  KEY `idx_workshop_agenda_time` (`workshop_id`, `start_time`),
  KEY `idx_workshop_agenda_facilitator` (`facilitator_id`),
  CONSTRAINT `fk_workshop_agenda_workshop` FOREIGN KEY (`workshop_id`) REFERENCES `workshops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_workshop_agenda_facilitator` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert some sample agenda item types for reference
-- You can modify these based on your needs
INSERT INTO `workshop_agenda` (`id`, `workshop_id`, `title`, `description`, `activity_type`, `start_time`, `end_time`, `duration_minutes`, `order_index`) VALUES
(UUID(), '550e8400-e29b-41d4-a716-446655440010', 'Welcome & Introductions', 'Opening session to welcome participants and introduce facilitators', 'session', '09:00:00', '09:30:00', 30, 1),
(UUID(), '550e8400-e29b-41d4-a716-446655440010', 'Coffee Break', 'Short break for refreshments', 'break', '10:30:00', '10:45:00', 15, 3),
(UUID(), '550e8400-e29b-41d4-a716-446655440010', 'Lunch Break', 'Lunch break for participants', 'break', '12:00:00', '13:00:00', 60, 5);

-- Verify the table was created
DESCRIBE workshop_agenda;

-- Show sample data
SELECT * FROM workshop_agenda ORDER BY workshop_id, order_index;
