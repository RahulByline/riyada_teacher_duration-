import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await executeQuery(
      'SELECT c.*, p.user_id FROM certificates c LEFT JOIN participants p ON c.participant_id = p.id ORDER BY c.issue_date DESC'
    );
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate certificate
router.post('/', async (req, res) => {
  try {
    const { participant_id, participant_name, program_title, completion_date, certificate_type, total_hours, cefr_level, grade, skills, template } = req.body;

    if (!participant_id || !participant_name || !program_title || !completion_date || !certificate_type || !total_hours) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const verification_code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const issue_date = new Date().toISOString().split('T')[0];

    const result = await executeQuery(
      'INSERT INTO certificates (participant_id, participant_name, program_title, completion_date, issue_date, certificate_type, total_hours, cefr_level, grade, skills, verification_code, template) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [participant_id, participant_name, program_title, completion_date, issue_date, certificate_type, total_hours, cefr_level, grade, JSON.stringify(skills), verification_code, template]
    );

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificate_id: result.insertId,
      verification_code
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
