import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await executeQuery(`
      SELECT w.*, u.name as facilitator_name, p.title as pathway_title,
             COUNT(DISTINCT pp.teacher_id) as pathway_participant_count
      FROM workshops w 
      LEFT JOIN users u ON w.facilitator_id = u.id 
      LEFT JOIN pathways p ON w.pathway_id = p.id 
      LEFT JOIN pathway_participants pp ON p.id = pp.pathway_id
      GROUP BY w.id, u.name, p.title
      ORDER BY w.workshop_date DESC
    `);
    res.json({ workshops });
  } catch (error) {
    console.error('Get workshops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workshops by pathway
router.get('/pathway/:pathwayId', async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const workshops = await executeQuery(`
      SELECT w.*, u.name as facilitator_name,
             COUNT(DISTINCT pp.teacher_id) as pathway_participant_count
      FROM workshops w 
      LEFT JOIN users u ON w.facilitator_id = u.id 
      LEFT JOIN pathway_participants pp ON w.pathway_id = pp.pathway_id
      WHERE w.pathway_id = ? 
      GROUP BY w.id, u.name
      ORDER BY w.workshop_date DESC
    `, [pathwayId]);
    res.json({ workshops });
  } catch (error) {
    console.error('Get pathway workshops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workshop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workshops = await executeQuery(
      'SELECT w.*, u.name as facilitator_name, p.title as pathway_title FROM workshops w LEFT JOIN users u ON w.facilitator_id = u.id LEFT JOIN pathways p ON w.pathway_id = p.id WHERE w.id = ?',
      [id]
    );
    
    if (workshops.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    
    res.json({ workshop: workshops[0] });
  } catch (error) {
    console.error('Get workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new workshop
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      facilitator_id, 
      max_participants, 
      workshop_date, 
      duration_hours, 
      location, 
      pathway_id, 
      materials_required, 
      prerequisites 
    } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || workshop_date === undefined || duration_hours === undefined) {
      console.log('❌ Undefined values detected:', { title, workshop_date, duration_hours });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!title || !workshop_date || !duration_hours) {
      return res.status(400).json({ error: 'Title, workshop date, and duration are required' });
    }

    // Generate a UUID for the workshop
    const workshopId = crypto.randomUUID();

    // Handle undefined parameters by providing default values
    const safeDescription = description || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeMaxParticipants = max_participants || 20;
    const safeLocation = location || null;
    const safePathwayId = pathway_id || null;
    const safeMaterialsRequired = materials_required ? JSON.stringify(materials_required) : null;
    const safePrerequisites = prerequisites ? JSON.stringify(prerequisites) : null;

    const result = await executeQuery(
      'INSERT INTO workshops (id, pathway_id, title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [workshopId, safePathwayId, title, safeDescription, safeFacilitatorId, safeMaxParticipants, workshop_date, duration_hours, safeLocation, safeMaterialsRequired, safePrerequisites]
    );

    const newWorkshop = await executeQuery(
      'SELECT * FROM workshops WHERE id = ?',
      [workshopId]
    );

    res.status(201).json({
      message: 'Workshop created successfully',
      workshop: newWorkshop[0]
    });
  } catch (error) {
    console.error('Create workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update workshop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, pathway_id, materials_required, prerequisites } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || workshop_date === undefined || duration_hours === undefined) {
      console.log('❌ Undefined values detected in update:', { title, workshop_date, duration_hours });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    // Handle undefined parameters by providing safe values
    const safeTitle = title || '';
    const safeDescription = description || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeMaxParticipants = max_participants || 20;
    const safeLocation = location || null;
    const safePathwayId = pathway_id || null;
    const safeMaterialsRequired = materials_required ? JSON.stringify(materials_required) : null;
    const safePrerequisites = prerequisites ? JSON.stringify(prerequisites) : null;

    const result = await executeQuery(
      'UPDATE workshops SET title = ?, description = ?, facilitator_id = ?, max_participants = ?, workshop_date = ?, duration_hours = ?, location = ?, pathway_id = ?, materials_required = ?, prerequisites = ? WHERE id = ?',
      [safeTitle, safeDescription, safeFacilitatorId, safeMaxParticipants, workshop_date, duration_hours, safeLocation, safePathwayId, safeMaterialsRequired, safePrerequisites, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const updatedWorkshop = await executeQuery(
      'SELECT * FROM workshops WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Workshop updated successfully',
      workshop: updatedWorkshop[0]
    });
  } catch (error) {
    console.error('Update workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete workshop
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM workshops WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Delete workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
