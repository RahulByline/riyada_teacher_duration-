import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Validate input
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await executeQuery(
      'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, name, hashedPassword, role]
    );

    // Get the created user (without password)
    const newUser = await executeQuery(
      'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser[0].id, email, role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0],
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple passcode-based login for demo purposes
router.post('/passcode-login', async (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({ error: 'Passcode is required' });
    }

    // Simple passcode logic (you can make this more sophisticated)
    let role, name, email;
    
    if (passcode.includes('admin')) {
      role = 'admin';
      name = 'System Administrator';
      email = 'admin@system.local';
    } else if (passcode.includes('trainer')) {
      role = 'trainer';
      name = 'Training Facilitator';
      email = 'trainer@system.local';
    } else if (passcode.includes('participant')) {
      role = 'participant';
      name = 'Course Participant';
      email = 'participant@system.local';
    } else if (passcode.includes('client')) {
      role = 'client';
      name = 'Client User';
      email = 'client@system.local';
    } else {
      role = 'participant';
      name = 'Default User';
      email = 'user@system.local';
    }

    // Check if user exists, if not create them
    let users = await executeQuery(
      'SELECT id, email, name, role, created_at FROM users WHERE email = ?',
      [email]
    );

    let user;
    if (users.length === 0) {
      // Create user if they don't exist
      const result = await executeQuery(
        'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
        [email, name, 'passcode-auth', role]
      );
      
      user = {
        id: result.insertId,
        email,
        name,
        role,
        created_at: new Date().toISOString()
      };
    } else {
      user = users[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Passcode login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user with password hash
    const users = await executeQuery(
      'SELECT id, email, name, role, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const users = await executeQuery(
      'SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;
