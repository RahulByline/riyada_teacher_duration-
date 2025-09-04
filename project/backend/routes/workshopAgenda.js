import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all agenda items for a workshop
router.get('/workshop/:workshopId', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const agendaItems = await executeQuery(
      'SELECT * FROM workshop_agenda WHERE workshop_id = ? ORDER BY start_time ASC',
      [workshopId]
    );
    res.json({ agendaItems });
  } catch (error) {
    console.error('Get workshop agenda error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update agenda items order (for drag and drop reordering)
router.put('/workshop/:workshopId/reorder', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { agendaItems } = req.body; // Array of {id, order_index}

    if (!Array.isArray(agendaItems)) {
      return res.status(400).json({ error: 'Agenda items array is required' });
    }

    // Update each agenda item's order
    for (const item of agendaItems) {
      await executeQuery(
        'UPDATE workshop_agenda SET order_index = ? WHERE id = ? AND workshop_id = ?',
        [item.order_index, item.id, workshopId]
      );
    }

    res.json({ message: 'Agenda items reordered successfully' });
  } catch (error) {
    console.error('Reorder agenda items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agenda item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agendaItems = await executeQuery(
      'SELECT * FROM workshop_agenda WHERE id = ?',
      [id]
    );

    if (agendaItems.length === 0) {
      return res.status(404).json({ error: 'Agenda item not found' });
    }

    res.json({ agendaItem: agendaItems[0] });
  } catch (error) {
    console.error('Get agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new agenda item
router.post('/', async (req, res) => {
  try {
    const { 
      workshop_id, 
      title, 
      description, 
      activity_type, 
      start_time, 
      end_time, 
      duration_minutes, 
      facilitator_id, 
      order_index,
      materials_needed,
      notes
    } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (workshop_id === undefined || title === undefined || activity_type === undefined || start_time === undefined || end_time === undefined) {
      console.log('❌ Undefined values detected:', { workshop_id, title, activity_type, start_time, end_time });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!workshop_id || !title || !activity_type || !start_time || !end_time) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate a UUID for the agenda item
    const agendaItemId = crypto.randomUUID();

    // Handle undefined parameters
    const safeDescription = description || null;
    const safeDurationMinutes = duration_minutes || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeOrderIndex = order_index || 0;
    const safeMaterialsNeeded = materials_needed ? JSON.stringify(materials_needed) : null;
    const safeNotes = notes || null;

    const result = await executeQuery(
      `INSERT INTO workshop_agenda (
        id, workshop_id, title, description, activity_type, start_time, end_time, 
        duration_minutes, facilitator_id, order_index, materials_needed, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agendaItemId, workshop_id, title, safeDescription, activity_type, start_time, end_time,
        safeDurationMinutes, safeFacilitatorId, safeOrderIndex, safeMaterialsNeeded, safeNotes
      ]
    );

    const newAgendaItem = await executeQuery(
      'SELECT * FROM workshop_agenda WHERE id = ?',
      [agendaItemId]
    );

    res.status(201).json({
      message: 'Agenda item created successfully',
      agendaItem: newAgendaItem[0]
    });
  } catch (error) {
    console.error('Create agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update agenda item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      activity_type, 
      start_time, 
      end_time, 
      duration_minutes, 
      facilitator_id, 
      order_index,
      materials_needed,
      notes
    } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || activity_type === undefined || start_time === undefined || end_time === undefined) {
      console.log('❌ Undefined values detected in update:', { title, activity_type, start_time, end_time });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    // Handle undefined parameters
    const safeTitle = title || '';
    const safeDescription = description || null;
    const safeDurationMinutes = duration_minutes || null;
    const safeFacilitatorId = facilitator_id || null;
    const safeOrderIndex = order_index || 0;
    const safeMaterialsNeeded = materials_needed ? JSON.stringify(materials_needed) : null;
    const safeNotes = notes || null;

    const result = await executeQuery(
      `UPDATE workshop_agenda SET 
        title = ?, description = ?, activity_type = ?, start_time = ?, end_time = ?,
        duration_minutes = ?, facilitator_id = ?, order_index = ?, materials_needed = ?, notes = ?
        WHERE id = ?`,
      [
        safeTitle, safeDescription, activity_type, start_time, end_time,
        safeDurationMinutes, safeFacilitatorId, safeOrderIndex, safeMaterialsNeeded, safeNotes, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agenda item not found' });
    }

    const updatedAgendaItem = await executeQuery(
      'SELECT * FROM workshop_agenda WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Agenda item updated successfully',
      agendaItem: updatedAgendaItem[0]
    });
  } catch (error) {
    console.error('Update agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update agenda item order (for drag and drop reordering)
router.put('/:id/order', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_index } = req.body;

    if (order_index === undefined) {
      return res.status(400).json({ error: 'Order index is required' });
    }

    const result = await executeQuery(
      'UPDATE workshop_agenda SET order_index = ? WHERE id = ?',
      [order_index, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agenda item not found' });
    }

    res.json({ message: 'Agenda item order updated successfully' });
  } catch (error) {
    console.error('Update agenda item order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete agenda item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM workshop_agenda WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agenda item not found' });
    }

    res.json({ message: 'Agenda item deleted successfully' });
  } catch (error) {
    console.error('Delete agenda item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
