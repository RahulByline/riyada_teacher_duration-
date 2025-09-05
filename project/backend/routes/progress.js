import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all progress records
router.get('/', async (req, res) => {
  try {
    const progress = await executeQuery(
      'SELECT pt.*, p.user_id, u.name as participant_name, le.title as event_title FROM progress_tracking pt LEFT JOIN participants p ON pt.participant_id = p.id LEFT JOIN users u ON p.user_id = u.id LEFT JOIN learning_events le ON pt.event_id = le.id ORDER BY pt.created_at DESC'
    );
    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress by participant
router.get('/participant/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    const progress = await executeQuery(
      'SELECT pt.*, le.title as event_title FROM progress_tracking pt LEFT JOIN learning_events le ON pt.event_id = le.id WHERE pt.participant_id = ? ORDER BY pt.created_at DESC',
      [participantId]
    );
    res.json({ progress });
  } catch (error) {
    console.error('Get participant progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress by event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const progress = await executeQuery(
      'SELECT pt.*, p.user_id, u.name as participant_name FROM progress_tracking pt LEFT JOIN participants p ON pt.participant_id = p.id LEFT JOIN users u ON p.user_id = u.id WHERE pt.event_id = ? ORDER BY pt.score DESC',
      [eventId]
    );
    res.json({ progress });
  } catch (error) {
    console.error('Get event progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const progress = await executeQuery(
      'SELECT pt.*, p.user_id, u.name as participant_name, le.title as event_title FROM progress_tracking pt LEFT JOIN participants p ON pt.participant_id = p.id LEFT JOIN users u ON p.user_id = u.id LEFT JOIN learning_events le ON pt.event_id = le.id WHERE pt.id = ?',
      [id]
    );

    if (progress.length === 0) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    res.json({ progress: progress[0] });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new progress record
router.post('/', async (req, res) => {
  try {
    const { participant_id, event_id, event_type, status, score, time_spent_minutes, notes } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (participant_id === undefined || event_id === undefined || event_type === undefined) {
      console.log('❌ Undefined values detected:', { participant_id, event_id, event_type });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!participant_id || !event_id || !event_type) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate a UUID for the progress record
    const progressId = crypto.randomUUID();

    const result = await executeQuery(
      'INSERT INTO progress_tracking (id, participant_id, event_id, event_type, status, score, time_spent_minutes, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [progressId, participant_id, event_id, event_type, status || 'not_started', score, time_spent_minutes || 0, notes]
    );

    const newProgress = await executeQuery(
      'SELECT * FROM progress_tracking WHERE id = ?',
      [progressId]
    );

    res.status(201).json({
      message: 'Progress record created successfully',
      progress: newProgress[0]
    });
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update progress record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, time_spent_minutes, last_accessed, completion_date, notes } = req.body;

    const result = await executeQuery(
      'UPDATE progress_tracking SET status = ?, score = ?, time_spent_minutes = ?, last_accessed = ?, completion_date = ?, notes = ? WHERE id = ?',
      [status, score, time_spent_minutes, last_accessed, completion_date, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    const updatedProgress = await executeQuery(
      'SELECT * FROM progress_tracking WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Progress record updated successfully',
      progress: updatedProgress[0]
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete progress record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM progress_tracking WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    res.json({ message: 'Progress record deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
