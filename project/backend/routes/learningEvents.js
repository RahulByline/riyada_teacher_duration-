import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all learning events
router.get('/', async (req, res) => {
  try {
    const events = await executeQuery(
      'SELECT le.*, p.title as pathway_title FROM learning_events le LEFT JOIN pathways p ON le.pathway_id = p.id ORDER BY le.start_date ASC'
    );
    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get events by pathway
router.get('/pathway/:pathwayId', async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const events = await executeQuery(
      'SELECT * FROM learning_events WHERE pathway_id = ? ORDER BY start_date ASC',
      [pathwayId]
    );
    res.json({ events });
  } catch (error) {
    console.error('Get pathway events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const { pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies } = req.body;

    if (!pathway_id || !title || !type || !start_date || !end_date || !duration || !format) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await executeQuery(
      'INSERT INTO learning_events (pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pathway_id, title, description, type, start_date, end_date, duration, format, JSON.stringify(objectives), JSON.stringify(resources), JSON.stringify(dependencies)]
    );

    const newEvent = await executeQuery(
      'SELECT * FROM learning_events WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Learning event created successfully',
      event: newEvent[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
