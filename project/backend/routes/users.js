import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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

// Get users by role
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const users = await executeQuery(
      'SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users WHERE role = ? ORDER BY name ASC',
      [role]
    );
    res.json({ users });
  } catch (error) {
    console.error('Get users by role error:', error);
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

// Create user (teacher)
router.post('/', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Check for undefined values (which MySQL2 doesn't allow)
    if (name === undefined || email === undefined || role === undefined || password === undefined) {
      console.log('❌ Undefined values detected:', { name, email, role, password: password ? '[PROVIDED]' : '[MISSING]' });
      return res.status(400).json({ error: 'Required fields cannot be undefined' });
    }

    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: 'Name, email, role, and password are required' });
    }

    // Validate role
    const validRoles = ['admin', 'trainer', 'teacher', 'participant', 'client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be one of: ' + validRoles.join(', ') });
    }

    // Check if email already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate UUID for the user
    const userId = crypto.randomUUID();

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const result = await executeQuery(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, role]
    );

    // Get the created user (without password)
    const newUser = await executeQuery(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
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
