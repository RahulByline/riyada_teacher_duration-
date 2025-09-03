import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const result = await executeQuery('SELECT 1 as test');
    res.json({ message: 'Database connection working', result });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

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

    console.log('📥 Received event data:', { pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies });

    if (!pathway_id || !title || !type || !start_date || !end_date || !duration || !format) {
      console.log('❌ Missing required fields:', { pathway_id: !!pathway_id, title: !!title, type: !!type, start_date: !!start_date, end_date: !!end_date, duration: !!duration, format: !!format });
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Convert undefined values to null for MySQL
    const safeDescription = description || null;
    const safeObjectives = objectives || [];
    const safeResources = resources || [];
    const safeDependencies = dependencies || [];

    console.log('🔧 Database insert data:', [pathway_id, title, safeDescription, type, start_date, end_date, duration, format, JSON.stringify(safeObjectives), JSON.stringify(safeResources), JSON.stringify(safeDependencies)]);

    const result = await executeQuery(
      'INSERT INTO learning_events (pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pathway_id, title, safeDescription, type, start_date, end_date, duration, format, JSON.stringify(safeObjectives), JSON.stringify(safeResources), JSON.stringify(safeDependencies)]
    );

    console.log('📊 Insert result:', result);
    console.log('🆔 New event ID:', result.insertId);

    const newEvent = await executeQuery(
      'SELECT * FROM learning_events WHERE id = ?',
      [result.insertId]
    );

    console.log('🔍 Fetched new event:', newEvent);
    console.log('📋 Event count returned:', newEvent.length);

    res.status(201).json({
      message: 'Learning event created successfully',
      event: newEvent[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
