import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all participants
router.get('/', async (req, res) => {
  try {
    const participants = await executeQuery(
      'SELECT p.*, u.name as user_name, u.email, pw.title as pathway_title FROM participants p LEFT JOIN users u ON p.user_id = u.id LEFT JOIN pathways pw ON p.pathway_id = pw.id ORDER BY p.enrollment_date DESC'
    );
    res.json({ participants });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get participants by pathway
router.get('/pathway/:pathwayId', async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const participants = await executeQuery(
      'SELECT p.*, u.name as user_name, u.email FROM participants p LEFT JOIN users u ON p.user_id = u.id WHERE p.pathway_id = ? ORDER BY p.enrollment_date DESC',
      [pathwayId]
    );
    res.json({ participants });
  } catch (error) {
    console.error('Get pathway participants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll participant
router.post('/', async (req, res) => {
  try {
    const { user_id, pathway_id, cefr_level_start, cefr_level_target } = req.body;

    if (!user_id || !pathway_id) {
      return res.status(400).json({ error: 'User ID and pathway ID are required' });
    }

    // Generate a UUID for the participant enrollment
    const enrollmentId = crypto.randomUUID();

    const result = await executeQuery(
      'INSERT INTO participants (id, user_id, pathway_id, cefr_level_start, cefr_level_target) VALUES (?, ?, ?, ?, ?)',
      [enrollmentId, user_id, pathway_id, cefr_level_start, cefr_level_target]
    );

    res.status(201).json({
      message: 'Participant enrolled successfully',
      enrollment_id: enrollmentId
    });
  } catch (error) {
    console.error('Enroll participant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
