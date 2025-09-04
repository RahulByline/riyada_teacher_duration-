-- Add placement fields to learning_events table
-- This allows events to be positioned exactly where they were created

ALTER TABLE learning_events 
ADD COLUMN month_index INT DEFAULT 1 COMMENT 'Month position (1, 2, 3, etc.)',
ADD COLUMN week_index INT DEFAULT 1 COMMENT 'Week position within month (1, 2, 3, 4)';

-- Update existing events to have default placement (Month 1, Week 1)
UPDATE learning_events SET month_index = 1, week_index = 1 WHERE month_index IS NULL OR week_index IS NULL;

-- Add index for better performance when querying by placement
CREATE INDEX idx_learning_events_placement ON learning_events(pathway_id, month_index, week_index);


