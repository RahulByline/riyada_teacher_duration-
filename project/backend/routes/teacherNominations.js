import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all teacher nominations
router.get('/', async (req, res) => {
  try {
    const nominations = await executeQuery(`
      SELECT tn.*, 
             u.name as nominated_by_name,
             GROUP_CONCAT(DISTINCT pe.pathway_id) as enrolled_pathways
      FROM teacher_nominations tn
      LEFT JOIN users u ON tn.nominated_by = u.id
      LEFT JOIN program_enrollments pe ON tn.id = pe.teacher_nomination_id
      GROUP BY tn.id
      ORDER BY tn.created_at DESC
    `);
    
    res.json({ nominations });
  } catch (error) {
    console.error('Get nominations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nomination by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nominations = await executeQuery(`
      SELECT tn.*, 
             u.name as nominated_by_name,
             GROUP_CONCAT(DISTINCT pe.pathway_id) as enrolled_pathways
      FROM teacher_nominations tn
      LEFT JOIN users u ON tn.nominated_by = u.id
      LEFT JOIN program_enrollments pe ON tn.id = pe.teacher_nomination_id
      WHERE tn.id = ?
      GROUP BY tn.id
    `, [id]);

    if (nominations.length === 0) {
      return res.status(404).json({ error: 'Nomination not found' });
    }

    res.json({ nomination: nominations[0] });
  } catch (error) {
    console.error('Get nomination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new nomination
router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, email, phone, position, department, school,
      years_experience, qualifications, subjects, cefr_level, training_needs,
      availability, notes
    } = req.body;

    if (!first_name || !last_name || !email || !position || !school || !years_experience) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await executeQuery(
      `INSERT INTO teacher_nominations (
        first_name, last_name, email, phone, position, department, school,
        years_experience, qualifications, subjects, cefr_level, training_needs,
        availability, nominated_by, nomination_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [
        first_name, last_name, email, phone, position, department, school,
        years_experience, JSON.stringify(qualifications || []), 
        JSON.stringify(subjects || []), cefr_level, 
        JSON.stringify(training_needs || []), availability, 
        req.user?.id || null, notes
      ]
    );

    const newNomination = await executeQuery(
      'SELECT * FROM teacher_nominations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Nomination created successfully',
      nomination: newNomination[0]
    });
  } catch (error) {
    console.error('Create nomination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update nomination status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await executeQuery(
      'UPDATE teacher_nominations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nomination not found' });
    }

    const updatedNomination = await executeQuery(
      'SELECT * FROM teacher_nominations WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Nomination status updated successfully',
      nomination: updatedNomination[0]
    });
  } catch (error) {
    console.error('Update nomination status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll in program
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
    const { pathway_id } = req.body;

    if (!pathway_id) {
      return res.status(400).json({ error: 'Pathway ID is required' });
    }

    // Check if nomination exists
    const nominations = await executeQuery(
      'SELECT * FROM teacher_nominations WHERE id = ?',
      [id]
    );

    if (nominations.length === 0) {
      return res.status(404).json({ error: 'Nomination not found' });
    }

    // Check if pathway exists
    const pathways = await executeQuery(
      'SELECT * FROM pathways WHERE id = ?',
      [pathway_id]
    );

    if (pathways.length === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Create enrollment
    const result = await executeQuery(
      'INSERT INTO program_enrollments (teacher_nomination_id, pathway_id, enrolled_by, enrollment_date) VALUES (?, ?, ?, CURDATE())',
      [id, pathway_id, req.user?.id || null]
    );

    // Update nomination status
    await executeQuery(
      'UPDATE teacher_nominations SET status = ? WHERE id = ?',
      ['enrolled', id]
    );

    res.status(201).json({
      message: 'Teacher enrolled in program successfully'
    });
  } catch (error) {
    console.error('Enroll in program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get program enrollments for a nomination
router.get('/:id/enrollments', async (req, res) => {
  try {
    const { id } = req.params;
    
    const enrollments = await executeQuery(`
      SELECT pe.*, p.title as pathway_title, p.description as pathway_description
      FROM program_enrollments pe
      LEFT JOIN pathways p ON pe.pathway_id = p.id
      WHERE pe.teacher_nomination_id = ?
      ORDER BY pe.enrollment_date DESC
    `, [id]);

    res.json({ enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
