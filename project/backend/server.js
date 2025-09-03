import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pathwayRoutes from './routes/pathways.js';
import learningEventRoutes from './routes/learningEvents.js';
import participantRoutes from './routes/participants.js';
import assessmentRoutes from './routes/assessments.js';
import certificateRoutes from './routes/certificates.js';
import feedbackRoutes from './routes/feedback.js';
import brandingRoutes from './routes/branding.js';
import workshopRoutes from './routes/workshops.js';
import workshopAgendaRoutes from './routes/workshopAgenda.js';
import resourceRoutes from './routes/resources.js';
import progressRoutes from './routes/progress.js';
import curriculumRoutes from './routes/curriculum.js';
import teacherNominationRoutes from './routes/teacherNominations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;



// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000'    
  ].filter(Boolean),
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'Connected' : 'Disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/learning-events', learningEventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/workshop-agenda', workshopAgendaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/teacher-nominations', teacherNominationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON payload'
    });
  }
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
