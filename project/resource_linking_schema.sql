-- Enhanced Resource Linking System
-- This creates comprehensive connections between resources and all learning components

-- 1. Add new linking fields to existing resources table
ALTER TABLE `resources` 
ADD COLUMN `workshop_id` VARCHAR(36) NULL,
ADD COLUMN `agenda_item_id` VARCHAR(36) NULL,
ADD COLUMN `learning_event_id` VARCHAR(36) NULL,
ADD COLUMN `assigned_to_user_id` VARCHAR(36) NULL,
ADD COLUMN `resource_context` ENUM('pathway', 'workshop', 'agenda_item', 'learning_event', 'user_specific', 'general') DEFAULT 'general',
ADD FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON DELETE SET NULL,
ADD FOREIGN KEY (`learning_event_id`) REFERENCES `learning_events`(`id`) ON DELETE SET NULL,
ADD FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL;

-- 2. Create resource_agenda_items table for many-to-many relationship
CREATE TABLE IF NOT EXISTS `resource_agenda_items` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `resource_id` VARCHAR(36) NOT NULL,
  `agenda_item_id` VARCHAR(36) NOT NULL,
  `resource_type` ENUM('required', 'optional', 'reference', 'handout') DEFAULT 'optional',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`agenda_item_id`) REFERENCES `workshop_agenda`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_resource_agenda` (`resource_id`, `agenda_item_id`)
);

-- 3. Create resource_workshops table for many-to-many relationship
CREATE TABLE IF NOT EXISTS `resource_workshops` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `resource_id` VARCHAR(36) NOT NULL,
  `workshop_id` VARCHAR(36) NOT NULL,
  `resource_type` ENUM('required', 'optional', 'reference', 'handout') DEFAULT 'optional',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_resource_workshop` (`resource_id`, `workshop_id`)
);

-- 4. Create resource_learning_events table for many-to-many relationship
CREATE TABLE IF NOT EXISTS `resource_learning_events` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `resource_id` VARCHAR(36) NOT NULL,
  `learning_event_id` VARCHAR(36) NOT NULL,
  `resource_type` ENUM('required', 'optional', 'reference', 'handout') DEFAULT 'optional',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`learning_event_id`) REFERENCES `learning_events`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_resource_learning_event` (`resource_id`, `learning_event_id`)
);

-- 5. Create resource_assignments table for user-specific resources
CREATE TABLE IF NOT EXISTS `resource_assignments` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `resource_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `assignment_type` ENUM('required', 'optional', 'reference', 'homework') DEFAULT 'optional',
  `due_date` DATE NULL,
  `assigned_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completion_status` ENUM('not_started', 'in_progress', 'completed', 'overdue') DEFAULT 'not_started',
  `completion_date` TIMESTAMP NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_resource_user` (`resource_id`, `user_id`)
);

-- 6. Add indexes for better performance
CREATE INDEX `idx_resources_workshop` ON `resources`(`workshop_id`);
CREATE INDEX `idx_resources_learning_event` ON `resources`(`learning_event_id`);
CREATE INDEX `idx_resources_user` ON `resources`(`assigned_to_user_id`);
CREATE INDEX `idx_resources_context` ON `resources`(`resource_context`);
CREATE INDEX `idx_resource_agenda_items_resource` ON `resource_agenda_items`(`resource_id`);
CREATE INDEX `idx_resource_agenda_items_agenda` ON `resource_agenda_items`(`agenda_item_id`);
CREATE INDEX `idx_resource_workshops_resource` ON `resource_workshops`(`resource_id`);
CREATE INDEX `idx_resource_workshops_workshop` ON `resource_workshops`(`workshop_id`);
CREATE INDEX `idx_resource_learning_events_resource` ON `resource_learning_events`(`resource_id`);
CREATE INDEX `idx_resource_learning_events_event` ON `resource_learning_events`(`learning_event_id`);
CREATE INDEX `idx_resource_assignments_resource` ON `resource_assignments`(`resource_id`);
CREATE INDEX `idx_resource_assignments_user` ON `resource_assignments`(`user_id`);

-- 7. Verify tables were created
SHOW TABLES LIKE 'resource_%';
DESCRIBE `resources`;
