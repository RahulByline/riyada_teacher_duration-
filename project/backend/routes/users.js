import express from 'express';
import { executeQuery } from '../config/database.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await executeQuery(
      'SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await executeQuery(
      'SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, avatar_url } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (name === undefined || role === undefined) {
      console.log('❌ Undefined values detected in update:', { name, role });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    const result = await executeQuery(
      'UPDATE users SET name = ?, role = ?, avatar_url = ? WHERE id = ?',
      [name, role, avatar_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user
    const users = await executeQuery(
      'SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({ 
      message: 'User updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
