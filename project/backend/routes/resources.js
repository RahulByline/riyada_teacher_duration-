import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await executeQuery(
      'SELECT r.*, u.name as created_by_name FROM resources r LEFT JOIN users u ON r.created_by = u.id ORDER BY r.created_at DESC'
    );
    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resources by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const resources = await executeQuery(
      'SELECT r.*, u.name as created_by_name FROM resources r LEFT JOIN users u ON r.created_by = u.id WHERE r.type = ? ORDER BY r.created_at DESC',
      [type]
    );
    res.json({ resources });
  } catch (error) {
    console.error('Get resources by type error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resources = await executeQuery(
      'SELECT r.*, u.name as created_by_name FROM resources r LEFT JOIN users u ON r.created_by = u.id WHERE r.id = ?',
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ resource: resources[0] });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new resource
router.post('/', async (req, res) => {
  try {
    const { title, description, type, format, category, file_size, tags, status, is_public, version, program_id, month_number, component_id } = req.body;

    console.log('📥 Received resource data:', { title, description, type, format, category, file_size, tags, status, is_public, version, program_id, month_number, component_id });

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Convert undefined values to null for MySQL
    const safeDescription = description || null;
    const safeCategory = category || 'trainer-resources';
    const safeFormat = format || 'pdf';
    const safeFileSize = file_size || '0 KB';
    const safeTags = tags || [];
    const safeStatus = status || 'draft';
    const safeIsPublic = is_public || false;
    const safeVersion = version || '1.0';
    const safeProgramId = program_id || null;
    const safeMonthNumber = month_number || null;
    const safeComponentId = component_id || null;

    console.log('🔧 Database insert data:', [title, safeDescription, type, safeFormat, safeCategory, safeFileSize, JSON.stringify(safeTags), safeStatus, safeIsPublic, safeVersion, safeProgramId, safeMonthNumber, safeComponentId]);

    const result = await executeQuery(
      'INSERT INTO resources (title, description, type, format, category, file_size, tags, status, is_public, version, program_id, month_number, component_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, safeDescription, type, safeFormat, safeCategory, safeFileSize, JSON.stringify(safeTags), safeStatus, safeIsPublic, safeVersion, safeProgramId, safeMonthNumber, safeComponentId]
    );

    const newResource = await executeQuery(
      'SELECT * FROM resources WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Resource created successfully',
      resource: newResource[0]
    });
  } catch (error) {
    console.error('Create resource error:', error);
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

// Update resource
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, url, file_path, file_size, mime_type, tags } = req.body;

    const result = await executeQuery(
      'UPDATE resources SET title = ?, description = ?, type = ?, url = ?, file_path = ?, file_size = ?, mime_type = ?, tags = ? WHERE id = ?',
      [title, description, type, url, file_path, file_size, mime_type, JSON.stringify(tags), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const updatedResource = await executeQuery(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Resource updated successfully',
      resource: updatedResource[0]
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM resources WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
