-- Create tables for pathway teacher and trainer assignments
-- This allows multiple teachers (participants) and trainers per pathway

-- Table for pathway participants (teachers who are being trained)
CREATE TABLE IF NOT EXISTS `pathway_participants` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pathway_id` VARCHAR(36) NOT NULL,
  `teacher_id` VARCHAR(36) NOT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('enrolled', 'active', 'completed', 'dropped') DEFAULT 'enrolled',
  `completion_date` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pathway_id`) REFERENCES `pathways`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_pathway_teacher` (`pathway_id`, `teacher_id`)
);

-- Table for pathway trainers (trainers who conduct the training)
CREATE TABLE IF NOT EXISTS `pathway_trainers` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pathway_id` VARCHAR(36) NOT NULL,
  `trainer_id` VARCHAR(36) NOT NULL,
  `role` ENUM('lead_trainer', 'assistant_trainer', 'guest_trainer') DEFAULT 'assistant_trainer',
  `assigned_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pathway_id`) REFERENCES `pathways`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trainer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_pathway_trainer` (`pathway_id`, `trainer_id`)
);

-- Add indexes for better performance
CREATE INDEX `idx_pathway_participants_pathway` ON `pathway_participants`(`pathway_id`);
CREATE INDEX `idx_pathway_participants_teacher` ON `pathway_participants`(`teacher_id`);
CREATE INDEX `idx_pathway_trainers_pathway` ON `pathway_trainers`(`pathway_id`);
CREATE INDEX `idx_pathway_trainers_trainer` ON `pathway_trainers`(`trainer_id`);

-- Verify tables were created
SHOW TABLES LIKE 'pathway_%';
