import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all pathways
router.get('/', async (req, res) => {
  try {
    const pathways = await executeQuery(
      'SELECT p.*, u.name as created_by_name FROM pathways p LEFT JOIN users u ON p.created_by = u.id ORDER BY p.created_at DESC'
    );
    res.json({ pathways });
  } catch (error) {
    console.error('Get pathways error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pathway by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pathways = await executeQuery(
      'SELECT p.*, u.name as created_by_name FROM pathways p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?',
      [id]
    );

    if (pathways.length === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    res.json({ pathway: pathways[0] });
  } catch (error) {
    console.error('Get pathway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new pathway
router.post('/', async (req, res) => {
  try {
    const { title, description, duration, total_hours, cefr_level, created_by } = req.body;

    console.log('📥 Received pathway data:', { title, description, duration, total_hours, cefr_level, created_by });

    if (!title || !duration || !total_hours || !created_by) {
      return res.status(400).json({ error: 'Title, duration, total_hours, and created_by are required' });
    }

    // Handle undefined values by converting them to null
    const safeDescription = description || null;
    const safeCefrLevel = cefr_level || null;

    console.log('🔧 Safe values for database:', { title, safeDescription, duration, total_hours, safeCefrLevel, created_by });

    const result = await executeQuery(
      'INSERT INTO pathways (title, description, duration, total_hours, cefr_level, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, safeDescription, duration, total_hours, safeCefrLevel, created_by]
    );

    const newPathway = await executeQuery(
      'SELECT * FROM pathways WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Pathway created successfully',
      pathway: newPathway[0]
    });
  } catch (error) {
    console.error('Create pathway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pathway
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, total_hours, status, cefr_level } = req.body;

    // Handle undefined values by converting them to null
    const safeDescription = description || null;
    const safeCefrLevel = cefr_level || null;

    const result = await executeQuery(
      'UPDATE pathways SET title = ?, description = ?, duration = ?, total_hours = ?, status = ?, cefr_level = ? WHERE id = ?',
      [title, safeDescription, duration, total_hours, status, safeCefrLevel, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    const updatedPathway = await executeQuery(
      'SELECT * FROM pathways WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Pathway updated successfully',
      pathway: updatedPathway[0]
    });
  } catch (error) {
    console.error('Update pathway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pathway
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM pathways WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    res.json({ message: 'Pathway deleted successfully' });
  } catch (error) {
    console.error('Delete pathway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
