import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all grades
router.get('/grades', async (req, res) => {
  try {
    const grades = await executeQuery(
      'SELECT * FROM grades ORDER BY grade_order ASC'
    );
    res.json({ grades });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get grade by ID
router.get('/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const grades = await executeQuery(
      'SELECT * FROM grades WHERE id = ?',
      [id]
    );

    if (grades.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json({ grade: grades[0] });
  } catch (error) {
    console.error('Get grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new grade
router.post('/grades', async (req, res) => {
  try {
    const { name, description, grade_order, color, min_score, max_score } = req.body;

    if (!name || !grade_order) {
      return res.status(400).json({ error: 'Name and grade order are required' });
    }

    const result = await executeQuery(
      'INSERT INTO grades (name, description, grade_order, color, min_score, max_score) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, grade_order, color, min_score, max_score]
    );

    const newGrade = await executeQuery(
      'SELECT * FROM grades WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Grade created successfully',
      grade: newGrade[0]
    });
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update grade
router.put('/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, grade_order, color, min_score, max_score } = req.body;

    const result = await executeQuery(
      'UPDATE grades SET name = ?, description = ?, grade_order = ?, color = ?, min_score = ?, max_score = ? WHERE id = ?',
      [name, description, grade_order, color, min_score, max_score, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    const updatedGrade = await executeQuery(
      'SELECT * FROM grades WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Grade updated successfully',
      grade: updatedGrade[0]
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete grade
router.delete('/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM grades WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get curriculum subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await executeQuery(
      'SELECT * FROM subjects ORDER BY name ASC'
    );
    res.json({ subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get curriculum units
router.get('/units', async (req, res) => {
  try {
    const units = await executeQuery(
      'SELECT u.*, s.name as subject_name FROM units u LEFT JOIN subjects s ON u.subject_id = s.id ORDER BY u.grade_order ASC, u.unit_order ASC'
    );
    res.json({ units });
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get curriculum lessons
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await executeQuery(
      'SELECT l.*, u.name as unit_name FROM lessons l LEFT JOIN units u ON l.unit_id = u.id ORDER BY l.lesson_order ASC'
    );
    res.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
