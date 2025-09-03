import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await executeQuery(
      'SELECT w.*, p.title as pathway_title, u.name as facilitator_name FROM workshops w LEFT JOIN pathways p ON w.pathway_id = p.id LEFT JOIN users u ON w.facilitator_id = u.id ORDER BY w.workshop_date ASC'
    );
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
    const workshops = await executeQuery(
      'SELECT w.*, u.name as facilitator_name FROM workshops w LEFT JOIN users u ON w.facilitator_id = u.id WHERE w.pathway_id = ? ORDER BY w.workshop_date ASC',
      [pathwayId]
    );
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
      'SELECT w.*, p.title as pathway_title, u.name as facilitator_name FROM workshops w LEFT JOIN pathways p ON w.pathway_id = p.id LEFT JOIN users u ON w.facilitator_id = u.id WHERE w.id = ?',
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
    const { pathway_id, title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites } = req.body;

    if (!pathway_id || !title || !workshop_date || !duration_hours) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate a UUID for the workshop
    const workshopId = crypto.randomUUID();

    // Handle undefined parameters by providing default values
    const safeDescription = description || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeMaxParticipants = max_participants || 20;
    const safeLocation = location || null;
    const safeMaterialsRequired = materials_required ? JSON.stringify(materials_required) : null;
    const safePrerequisites = prerequisites ? JSON.stringify(prerequisites) : null;

    const result = await executeQuery(
      'INSERT INTO workshops (id, pathway_id, title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [workshopId, pathway_id, title, safeDescription, safeFacilitatorId, safeMaxParticipants, workshop_date, duration_hours, safeLocation, safeMaterialsRequired, safePrerequisites]
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
    const { title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites } = req.body;

    // Handle undefined parameters by providing safe values
    const safeTitle = title || '';
    const safeDescription = description || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeMaxParticipants = max_participants || 20;
    const safeLocation = location || null;
    const safeMaterialsRequired = materials_required ? JSON.stringify(materials_required) : null;
    const safePrerequisites = prerequisites ? JSON.stringify(prerequisites) : null;

    const result = await executeQuery(
      'UPDATE workshops SET title = ?, description = ?, facilitator_id = ?, max_participants = ?, workshop_date = ?, duration_hours = ?, location = ?, materials_required = ?, prerequisites = ? WHERE id = ?',
      [safeTitle, safeDescription, safeFacilitatorId, safeMaxParticipants, workshop_date, duration_hours, safeLocation, safeMaterialsRequired, safePrerequisites, id]
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
