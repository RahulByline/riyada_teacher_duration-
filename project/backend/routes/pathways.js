import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get all pathways
router.get('/', async (req, res) => {
  try {
    const pathways = await executeQuery(`
      SELECT 
        p.*, 
        u.name as created_by_name,
        COUNT(DISTINCT pp.teacher_id) as participant_count,
        COUNT(DISTINCT pt.trainer_id) as trainer_count
      FROM pathways p 
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN pathway_participants pp ON p.id = pp.pathway_id
      LEFT JOIN pathway_trainers pt ON p.id = pt.pathway_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
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
    const { title, description, duration, total_hours, cefr_level, created_by, participants, trainers } = req.body;

    console.log('📥 Received pathway data:', { title, description, duration, total_hours, cefr_level, created_by, participants, trainers });

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || duration === undefined || total_hours === undefined || created_by === undefined) {
      console.log('❌ Undefined values detected:', { title, duration, total_hours, created_by });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!title || !duration || !total_hours || !created_by) {
      return res.status(400).json({ error: 'Title, duration, total_hours, and created_by are required' });
    }

    // Handle undefined values by converting them to null
    const safeDescription = description || null;
    const safeCefrLevel = cefr_level || null;

    console.log('🔧 Safe values for database:', { title, safeDescription, duration, total_hours, safeCefrLevel, created_by });

    // Generate a UUID for the pathway
    const pathwayId = crypto.randomUUID();

    // Create the pathway first
    const result = await executeQuery(
      'INSERT INTO pathways (id, title, description, duration, total_hours, cefr_level, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pathwayId, title, safeDescription, duration, total_hours, safeCefrLevel, created_by]
    );

    // Add participants (teachers) if provided
    if (participants && Array.isArray(participants) && participants.length > 0) {
      for (const teacherId of participants) {
        const participantId = crypto.randomUUID();
        await executeQuery(
          'INSERT INTO pathway_participants (id, pathway_id, teacher_id) VALUES (?, ?, ?)',
          [participantId, pathwayId, teacherId]
        );
      }
    }

    // Add trainers if provided
    if (trainers && Array.isArray(trainers) && trainers.length > 0) {
      for (const trainer of trainers) {
        const trainerAssignmentId = crypto.randomUUID();
        await executeQuery(
          'INSERT INTO pathway_trainers (id, pathway_id, trainer_id, role) VALUES (?, ?, ?, ?)',
          [trainerAssignmentId, pathwayId, trainer.id, trainer.role || 'assistant_trainer']
        );
      }
    }

    const newPathway = await executeQuery(
      'SELECT * FROM pathways WHERE id = ?',
      [pathwayId]
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
    const { title, description, duration, total_hours, status, cefr_level, participants, trainers } = req.body;

    console.log('📥 Received pathway update data:', { title, description, duration, total_hours, status, cefr_level, participants, trainers });

    // Check for undefined values (which MySQL2 doesn't allow)
    if (title === undefined || duration === undefined || total_hours === undefined) {
      console.log('❌ Undefined values detected in update:', { title, duration, total_hours });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    // Handle undefined values by converting them to null
    const safeDescription = description || null;
    const safeCefrLevel = cefr_level || null;

    // Update the pathway basic information
    const result = await executeQuery(
      'UPDATE pathways SET title = ?, description = ?, duration = ?, total_hours = ?, status = ?, cefr_level = ? WHERE id = ?',
      [title, safeDescription, duration, total_hours, status, safeCefrLevel, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Update participants if provided
    if (participants !== undefined) {
      // Remove existing participants
      await executeQuery('DELETE FROM pathway_participants WHERE pathway_id = ?', [id]);
      
      // Add new participants
      if (Array.isArray(participants) && participants.length > 0) {
        for (const teacherId of participants) {
          const participantId = crypto.randomUUID();
          await executeQuery(
            'INSERT INTO pathway_participants (id, pathway_id, teacher_id) VALUES (?, ?, ?)',
            [participantId, id, teacherId]
          );
        }
      }
    }

    // Update trainers if provided
    if (trainers !== undefined) {
      // Remove existing trainers
      await executeQuery('DELETE FROM pathway_trainers WHERE pathway_id = ?', [id]);
      
      // Add new trainers
      if (Array.isArray(trainers) && trainers.length > 0) {
        for (const trainer of trainers) {
          const trainerAssignmentId = crypto.randomUUID();
          await executeQuery(
            'INSERT INTO pathway_trainers (id, pathway_id, trainer_id, role) VALUES (?, ?, ?, ?)',
            [trainerAssignmentId, id, trainer.id, trainer.role || 'assistant_trainer']
          );
        }
      }
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

// Get pathway participants (teachers)
router.get('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await executeQuery(`
      SELECT pp.*, u.name, u.email, u.role 
      FROM pathway_participants pp 
      JOIN users u ON pp.teacher_id = u.id 
      WHERE pp.pathway_id = ?
      ORDER BY pp.enrollment_date DESC
    `, [id]);
    
    res.json({ participants });
  } catch (error) {
    console.error('Get pathway participants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pathway trainers
router.get('/:id/trainers', async (req, res) => {
  try {
    const { id } = req.params;
    const trainers = await executeQuery(`
      SELECT pt.*, u.name, u.email, u.role 
      FROM pathway_trainers pt 
      JOIN users u ON pt.trainer_id = u.id 
      WHERE pt.pathway_id = ?
      ORDER BY pt.assigned_date DESC
    `, [id]);
    
    res.json({ trainers });
  } catch (error) {
    console.error('Get pathway trainers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add participant to pathway
router.post('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id } = req.body;
    
    if (!teacher_id) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }
    
    const participantId = crypto.randomUUID();
    await executeQuery(
      'INSERT INTO pathway_participants (id, pathway_id, teacher_id) VALUES (?, ?, ?)',
      [participantId, id, teacher_id]
    );
    
    res.status(201).json({ message: 'Participant added successfully' });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add trainer to pathway
router.post('/:id/trainers', async (req, res) => {
  try {
    const { id } = req.params;
    const { trainer_id, role } = req.body;
    
    if (!trainer_id) {
      return res.status(400).json({ error: 'Trainer ID is required' });
    }
    
    const trainerAssignmentId = crypto.randomUUID();
    await executeQuery(
      'INSERT INTO pathway_trainers (id, pathway_id, trainer_id, role) VALUES (?, ?, ?, ?)',
      [trainerAssignmentId, id, trainer_id, role || 'assistant_trainer']
    );
    
    res.status(201).json({ message: 'Trainer added successfully' });
  } catch (error) {
    console.error('Add trainer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove participant from pathway
router.delete('/:id/participants/:participant_id', async (req, res) => {
  try {
    const { id, participant_id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM pathway_participants WHERE id = ? AND pathway_id = ?',
      [participant_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    res.json({ message: 'Participant removed successfully' });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove trainer from pathway
router.delete('/:id/trainers/:trainer_assignment_id', async (req, res) => {
  try {
    const { id, trainer_assignment_id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM pathway_trainers WHERE id = ? AND pathway_id = ?',
      [trainer_assignment_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trainer assignment not found' });
    }
    
    res.json({ message: 'Trainer removed successfully' });
  } catch (error) {
    console.error('Remove trainer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pathways by participant ID
router.get('/participant/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    
    const pathways = await executeQuery(`
      SELECT DISTINCT p.*, 
             COUNT(DISTINCT pp.teacher_id) as participant_count,
             COUNT(DISTINCT pt.trainer_id) as trainer_count
      FROM pathways p
      LEFT JOIN pathway_participants pp ON p.id = pp.pathway_id
      LEFT JOIN pathway_trainers pt ON p.id = pt.pathway_id
      WHERE pp.teacher_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [participantId]);
    
    res.json({ pathways });
  } catch (error) {
    console.error('Get pathways by participant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
