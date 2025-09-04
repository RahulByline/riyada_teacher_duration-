import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

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

// Check table structure
router.get('/table-structure', async (req, res) => {
  try {
    const structure = await executeQuery('DESCRIBE learning_events');
    res.json({ message: 'Table structure retrieved', structure });
  } catch (error) {
    console.error('Table structure error:', error);
    res.status(500).json({ error: 'Failed to get table structure', details: error.message });
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
    const { pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies, month_index, week_index } = req.body;

    console.log('📥 Received event data:', { pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies });

    // Check for undefined values (which MySQL2 doesn't allow)
    if (pathway_id === undefined || title === undefined || type === undefined || start_date === undefined || end_date === undefined || duration === undefined || format === undefined || month_index === undefined || week_index === undefined) {
      console.log('❌ Undefined values detected:', { pathway_id, title, type, start_date, end_date, duration, format, month_index, week_index });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!pathway_id || !title || !type || !start_date || !end_date || !duration || !format || !month_index || !week_index) {
      console.log('❌ Missing required fields:', { pathway_id: !!pathway_id, title: !!title, type: !!type, start_date: !!start_date, end_date: !!end_date, duration: !!duration, format: !!format, month_index: !!month_index, week_index: !!week_index });
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Convert undefined values to null for MySQL
    const safeDescription = description === undefined ? null : (description || null);
    const safeObjectives = objectives === undefined ? [] : (objectives || []);
    const safeResources = resources === undefined ? [] : (resources || []);
    const safeDependencies = dependencies === undefined ? [] : (dependencies || []);

    // Ensure all values are safe for MySQL (no undefined values)
    const safePathwayId = pathway_id === undefined ? null : pathway_id;
    const safeTitle = title === undefined ? null : title;
    const safeType = type === undefined ? null : type;
    const safeStartDate = start_date === undefined ? null : start_date;
    const safeEndDate = end_date === undefined ? null : end_date;
    const safeDuration = duration === undefined ? null : duration;
    const safeFormat = format === undefined ? null : format;
    const safeMonthIndex = month_index === undefined ? 1 : month_index;
    const safeWeekIndex = week_index === undefined ? 1 : week_index;

    console.log('🔧 Database insert data:', [safePathwayId, safeTitle, safeDescription, safeType, safeStartDate, safeEndDate, safeDuration, safeFormat, JSON.stringify(safeObjectives), JSON.stringify(safeResources), JSON.stringify(safeDependencies)]);

    // Generate a UUID for the learning event
    const eventId = crypto.randomUUID();
    
    console.log('🔑 Generated UUID:', eventId);
    console.log('🔑 UUID type:', typeof eventId);
    console.log('🔑 UUID length:', eventId.length);

    // First, let's check if the table has an auto-incrementing ID
    const tableInfo = await executeQuery('SHOW CREATE TABLE learning_events');
    console.log('🏗️ Table structure:', tableInfo);
    
    // Also check the column names and order
    const columns = await executeQuery('SHOW COLUMNS FROM learning_events');
    console.log('📋 Table columns:', columns);

    const result = await executeQuery(
      'INSERT INTO learning_events (id, pathway_id, title, description, type, start_date, end_date, duration, format, objectives, resources, dependencies, month_index, week_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [eventId, safePathwayId, safeTitle, safeDescription, safeType, safeStartDate, safeEndDate, safeDuration, safeFormat, JSON.stringify(safeObjectives), JSON.stringify(safeResources), JSON.stringify(safeDependencies), safeMonthIndex, safeWeekIndex]
    );

    console.log('📊 Insert result:', result);
    console.log('📊 Insert result keys:', Object.keys(result));
    console.log('📊 Insert result values:', Object.values(result));
    console.log('🆔 Generated UUID:', eventId);
    console.log('🆔 UUID in result:', result.insertId);

    const newEvent = await executeQuery(
      'SELECT * FROM learning_events WHERE id = ?',
      [eventId]
    );

    console.log('🔍 Fetched new event:', newEvent);
    console.log('🔍 Fetched new event ID:', newEvent[0]?.id);
    console.log('🔍 Fetched new event ID type:', typeof newEvent[0]?.id);
    console.log('🔍 Fetched new event ID length:', newEvent[0]?.id?.length);
    console.log('📋 Event count returned:', newEvent.length);

    // Fallback: if the ID is empty, try to get the last inserted record
    if (!newEvent[0]?.id || newEvent[0].id === '') {
      console.log('⚠️ ID is empty, trying fallback approach...');
      
      // Try to get the most recent event for this pathway
      const fallbackEvent = await executeQuery(
        'SELECT * FROM learning_events WHERE pathway_id = ? ORDER BY created_at DESC LIMIT 1',
        [safePathwayId]
      );
      console.log('🔄 Fallback event:', fallbackEvent);
      
      if (fallbackEvent.length > 0) {
        newEvent[0] = fallbackEvent[0];
        console.log('✅ Using fallback event with ID:', newEvent[0].id);
      } else {
        // If still no ID, try to get any recent event
        const anyEvent = await executeQuery(
          'SELECT * FROM learning_events ORDER BY created_at DESC LIMIT 1'
        );
        console.log('🔄 Any recent event:', anyEvent);
        if (anyEvent.length > 0) {
          newEvent[0] = anyEvent[0];
          console.log('✅ Using any recent event with ID:', newEvent[0].id);
        }
      }
    }

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
