import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await executeQuery(
      'SELECT a.*, p.user_id, u.name as participant_name FROM assessments a LEFT JOIN participants p ON a.participant_id = p.id LEFT JOIN users u ON p.user_id = u.id ORDER BY a.assessment_date DESC'
    );
    res.json({ assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create assessment
router.post('/', async (req, res) => {
  try {
    const { participant_id, assessment_date, overall_level, skill_levels, recommendations, pathway_adjustments } = req.body;

    if (!participant_id || !assessment_date || !overall_level || !skill_levels) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate a UUID for the assessment
    const assessmentId = crypto.randomUUID();

    const result = await executeQuery(
      'INSERT INTO assessments (id, participant_id, assessment_date, overall_level, skill_levels, recommendations, pathway_adjustments) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [assessmentId, participant_id, assessment_date, overall_level, JSON.stringify(skill_levels), JSON.stringify(recommendations), JSON.stringify(pathway_adjustments)]
    );

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment_id: assessmentId
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
