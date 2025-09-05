import express from 'express';
import { executeQuery } from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Get branding settings
router.get('/', async (req, res) => {
  try {
    const settings = await executeQuery(
      'SELECT * FROM branding_settings ORDER BY created_at DESC LIMIT 1'
    );
    
    if (settings.length === 0) {
      return res.status(404).json({ error: 'No branding settings found' });
    }
    
    res.json({ settings: settings[0] });
  } catch (error) {
    console.error('Get branding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update branding settings
router.put('/', async (req, res) => {
  try {
    const { portal_name, logo_url, primary_color, secondary_color, accent_color } = req.body;

    if (!portal_name || !primary_color || !secondary_color || !accent_color) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await executeQuery(
      'UPDATE branding_settings SET portal_name = ?, logo_url = ?, primary_color = ?, secondary_color = ?, accent_color = ? WHERE id = (SELECT id FROM (SELECT id FROM branding_settings ORDER BY created_at DESC LIMIT 1) as sub)',
      [portal_name, logo_url, primary_color, secondary_color, accent_color]
    );

    if (result.affectedRows === 0) {
      // Create new settings if none exist
      const brandingId = crypto.randomUUID();
      await executeQuery(
        'INSERT INTO branding_settings (id, portal_name, logo_url, primary_color, secondary_color, accent_color) VALUES (?, ?, ?, ?, ?, ?)',
        [brandingId, portal_name, logo_url, primary_color, secondary_color, accent_color]
      );
    }

    res.json({ message: 'Branding settings updated successfully' });
  } catch (error) {
    console.error('Update branding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
