import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await executeQuery(
      'SELECT f.*, p.user_id, u.name as participant_name FROM feedback_responses f LEFT JOIN participants p ON f.participant_id = p.id LEFT JOIN users u ON p.user_id = u.id ORDER BY f.submission_date DESC'
    );
    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { participant_id, event_id, event_type, responses, overall_rating, comments, anonymous } = req.body;

    if (!participant_id || !event_id || !event_type || !responses || !overall_rating) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate a UUID for the feedback response
    const feedbackId = crypto.randomUUID();
    const submission_date = new Date().toISOString();

    const result = await executeQuery(
      'INSERT INTO feedback_responses (id, participant_id, event_id, event_type, submission_date, responses, overall_rating, comments, anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [feedbackId, participant_id, event_id, event_type, submission_date, JSON.stringify(responses), overall_rating, comments, anonymous || false]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback_id: feedbackId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
