import express from 'express';
import { executeQuery } from '../config/database.js';

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

    // Convert undefined values to null for MySQL
    const safeDescription = description || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeMaxParticipants = max_participants || 20;
    const safeLocation = location || null;
    const safeMaterialsRequired = materials_required || [];
    const safePrerequisites = prerequisites || [];

    const result = await executeQuery(
      'INSERT INTO workshops (pathway_id, title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pathway_id, title, safeDescription, safeFacilitatorId, safeMaxParticipants, workshop_date, duration_hours, safeLocation, JSON.stringify(safeMaterialsRequired), JSON.stringify(safePrerequisites)]
    );

    const newWorkshop = await executeQuery(
      'SELECT * FROM workshops WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Workshop created successfully',
      workshop: newWorkshop[0]
    });
  } catch (error) {
    console.error('Create workshop error:', error);
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

// Update workshop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, materials_required, prerequisites } = req.body;

    const result = await executeQuery(
      'UPDATE workshops SET title = ?, description = ?, facilitator_id = ?, max_participants = ?, workshop_date = ?, duration_hours = ?, location = ?, materials_required = ?, prerequisites = ? WHERE id = ?',
      [title, description, facilitator_id, max_participants, workshop_date, duration_hours, location, JSON.stringify(materials_required), JSON.stringify(prerequisites), id]
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
