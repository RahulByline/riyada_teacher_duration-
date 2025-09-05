import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resources';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain',
      'text/html'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP4, AVI, MOV, JPG, PNG, GIF, ZIP, RAR, TXT, and HTML files are allowed.'));
    }
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await executeQuery(
      'SELECT r.*, u.name as created_by_name FROM resources r LEFT JOIN users u ON r.created_by = u.id ORDER BY r.created_at DESC'
    );
    
    // Ensure tags are properly formatted as arrays
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
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
    
    // Ensure tags are properly formatted as arrays
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
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

    // Ensure tags are properly formatted as arrays
    const resource = {
      ...resources[0],
      tags: resources[0].tags || []
    };

    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new resource with file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { 
      title, description, type, format, category, tags, status, is_public, version, 
      program_id, month_number, component_id, workshop_id, agenda_item_id, 
      learning_event_id, assigned_to_user_id, resource_context 
    } = req.body;
    const uploadedFile = req.file;

    console.log('📥 Received resource data:', { 
      title, description, type, format, category, tags, status, is_public, version, 
      program_id, month_number, component_id, workshop_id, agenda_item_id, 
      learning_event_id, assigned_to_user_id, resource_context 
    });
    console.log('📁 Uploaded file:', uploadedFile ? { originalname: uploadedFile.originalname, size: uploadedFile.size, mimetype: uploadedFile.mimetype } : 'No file');

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || type === undefined) {
      console.log('❌ Undefined values detected:', { title, type });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Convert undefined values to null for MySQL
    const safeDescription = description || null;
    const safeCategory = category || 'trainer-resources';
    const safeFormat = format || (uploadedFile ? path.extname(uploadedFile.originalname).slice(1).toLowerCase() : 'pdf');
    const safeFileSize = uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : '0 KB';
    const safeTags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];
    const safeStatus = status || 'draft';
    const safeIsPublic = is_public === 'true' || is_public === true;
    const safeVersion = version || '1.0';
    const safeProgramId = program_id || null;
    const safeMonthNumber = month_number ? parseInt(month_number) : null;
    const safeComponentId = component_id || null;
    const safeWorkshopId = workshop_id || null;
    const safeAgendaItemId = agenda_item_id || null;
    const safeLearningEventId = learning_event_id || null;
    const safeAssignedToUserId = assigned_to_user_id || null;
    const safeResourceContext = resource_context || 'general';
    const safeUrl = uploadedFile ? `/uploads/resources/${uploadedFile.filename}` : null;
    const safeMimeType = uploadedFile ? uploadedFile.mimetype : null;

    // Generate a UUID for the resource
    const resourceId = crypto.randomUUID();

    console.log('🔧 Database insert data:', [resourceId, title, safeDescription, type, safeFormat, safeCategory, safeUrl, safeFileSize, safeMimeType, JSON.stringify(safeTags), safeStatus, safeIsPublic, safeVersion, safeProgramId, safeMonthNumber, safeComponentId, safeWorkshopId, safeAgendaItemId, safeLearningEventId, safeAssignedToUserId, safeResourceContext]);

    const result = await executeQuery(
      'INSERT INTO resources (id, title, description, type, format, category, url, file_size, mime_type, tags, status, is_public, version, program_id, month_number, component_id, workshop_id, agenda_item_id, learning_event_id, assigned_to_user_id, resource_context) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [resourceId, title, safeDescription, type, safeFormat, safeCategory, safeUrl, safeFileSize, safeMimeType, JSON.stringify(safeTags), safeStatus, safeIsPublic, safeVersion, safeProgramId, safeMonthNumber, safeComponentId, safeWorkshopId, safeAgendaItemId, safeLearningEventId, safeAssignedToUserId, safeResourceContext]
    );

    const newResource = await executeQuery(
      'SELECT r.*, u.name as created_by_name FROM resources r LEFT JOIN users u ON r.created_by = u.id WHERE r.id = ?',
      [resourceId]
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
    
    // Clean up uploaded file if database insert failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    
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

// Download resource file
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const resources = await executeQuery(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = resources[0];
    
    if (!resource.url) {
      return res.status(404).json({ error: 'File not available for download' });
    }

    const filePath = path.join(process.cwd(), resource.url);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Download count tracking removed

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${resource.title}.${resource.format}"`);
    res.setHeader('Content-Type', resource.mime_type || 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get resource info before deletion
    const resources = await executeQuery(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = resources[0];
    
    // Delete from database
    const result = await executeQuery(
      'DELETE FROM resources WHERE id = ?',
      [id]
    );

    // Delete file from filesystem if it exists
    if (resource.url) {
      const filePath = path.join(process.cwd(), resource.url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resources by workshop
router.get('/workshop/:workshopId', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const resources = await executeQuery(`
      SELECT r.*, u.name as created_by_name 
      FROM resources r 
      LEFT JOIN users u ON r.created_by = u.id 
      WHERE r.workshop_id = ? OR r.id IN (
        SELECT resource_id FROM resource_workshops WHERE workshop_id = ?
      )
      ORDER BY r.created_at DESC
    `, [workshopId, workshopId]);
    
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
  } catch (error) {
    console.error('Get resources by workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resources by agenda item
router.get('/agenda/:agendaItemId', async (req, res) => {
  try {
    const { agendaItemId } = req.params;
    const resources = await executeQuery(`
      SELECT r.*, u.name as created_by_name, rai.resource_type, rai.display_order
      FROM resources r 
      LEFT JOIN users u ON r.created_by = u.id 
      LEFT JOIN resource_agenda_items rai ON r.id = rai.resource_id
      WHERE r.agenda_item_id = ? OR rai.agenda_item_id = ?
      ORDER BY rai.display_order ASC, r.created_at DESC
    `, [agendaItemId, agendaItemId]);
    
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
  } catch (error) {
    console.error('Get resources by agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resources by learning event
router.get('/learning-event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const resources = await executeQuery(`
      SELECT r.*, u.name as created_by_name 
      FROM resources r 
      LEFT JOIN users u ON r.created_by = u.id 
      WHERE r.learning_event_id = ? OR r.id IN (
        SELECT resource_id FROM resource_learning_events WHERE learning_event_id = ?
      )
      ORDER BY r.created_at DESC
    `, [eventId, eventId]);
    
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
  } catch (error) {
    console.error('Get resources by learning event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resources by pathway
router.get('/pathway/:pathwayId', async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const resources = await executeQuery(`
      SELECT r.*, u.name as created_by_name 
      FROM resources r 
      LEFT JOIN users u ON r.created_by = u.id 
      WHERE r.program_id = ? OR r.id IN (
        SELECT resource_id FROM resource_workshops rw 
        JOIN workshops w ON rw.workshop_id = w.id 
        WHERE w.pathway_id = ?
      ) OR r.id IN (
        SELECT resource_id FROM resource_learning_events rle 
        JOIN learning_events le ON rle.learning_event_id = le.id 
        WHERE le.pathway_id = ?
      )
      ORDER BY r.created_at DESC
    `, [pathwayId, pathwayId, pathwayId]);
    
    const formattedResources = resources.map(resource => ({
      ...resource,
      tags: resource.tags || []
    }));
    
    res.json({ resources: formattedResources });
  } catch (error) {
    console.error('Get resources by pathway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link resource to workshop
router.post('/link/workshop', async (req, res) => {
  try {
    const { resource_id, workshop_id, resource_type, display_order } = req.body;
    
    if (!resource_id || !workshop_id) {
      return res.status(400).json({ error: 'Resource ID and Workshop ID are required' });
    }
    
    const linkId = crypto.randomUUID();
    await executeQuery(
      'INSERT INTO resource_workshops (id, resource_id, workshop_id, resource_type, display_order) VALUES (?, ?, ?, ?, ?)',
      [linkId, resource_id, workshop_id, resource_type || 'optional', display_order || 0]
    );
    
    res.status(201).json({ message: 'Resource linked to workshop successfully' });
  } catch (error) {
    console.error('Link resource to workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link resource to agenda item
router.post('/link/agenda', async (req, res) => {
  try {
    const { resource_id, agenda_item_id, resource_type, display_order } = req.body;
    
    if (!resource_id || !agenda_item_id) {
      return res.status(400).json({ error: 'Resource ID and Agenda Item ID are required' });
    }
    
    const linkId = crypto.randomUUID();
    await executeQuery(
      'INSERT INTO resource_agenda_items (id, resource_id, agenda_item_id, resource_type, display_order) VALUES (?, ?, ?, ?, ?)',
      [linkId, resource_id, agenda_item_id, resource_type || 'optional', display_order || 0]
    );
    
    res.status(201).json({ message: 'Resource linked to agenda item successfully' });
  } catch (error) {
    console.error('Link resource to agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link resource to learning event
router.post('/link/learning-event', async (req, res) => {
  try {
    const { resource_id, learning_event_id, resource_type, display_order } = req.body;
    
    if (!resource_id || !learning_event_id) {
      return res.status(400).json({ error: 'Resource ID and Learning Event ID are required' });
    }
    
    const linkId = crypto.randomUUID();
    await executeQuery(
      'INSERT INTO resource_learning_events (id, resource_id, learning_event_id, resource_type, display_order) VALUES (?, ?, ?, ?, ?)',
      [linkId, resource_id, learning_event_id, resource_type || 'optional', display_order || 0]
    );
    
    res.status(201).json({ message: 'Resource linked to learning event successfully' });
  } catch (error) {
    console.error('Link resource to learning event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlink resource from workshop
router.delete('/unlink/workshop/:resourceId/:workshopId', async (req, res) => {
  try {
    const { resourceId, workshopId } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM resource_workshops WHERE resource_id = ? AND workshop_id = ?',
      [resourceId, workshopId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource-workshop link not found' });
    }
    
    res.json({ message: 'Resource unlinked from workshop successfully' });
  } catch (error) {
    console.error('Unlink resource from workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlink resource from agenda item
router.delete('/unlink/agenda/:resourceId/:agendaItemId', async (req, res) => {
  try {
    const { resourceId, agendaItemId } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM resource_agenda_items WHERE resource_id = ? AND agenda_item_id = ?',
      [resourceId, agendaItemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource-agenda item link not found' });
    }
    
    res.json({ message: 'Resource unlinked from agenda item successfully' });
  } catch (error) {
    console.error('Unlink resource from agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
