const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth');

// Import database connection
const connectDB = require('./src/config/database');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Static files (if serving any static files from server)
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler for API routes - FIXED THIS PART
app.use('/api/:any', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Serve static assets in production (if you're serving React build from Express)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // This should be your last route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Development 404 handler - FIXED THIS PART TOO
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      message: 'Make sure you are calling a valid API endpoint'
    });
  });
}

// Error handling middleware (should be last)
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;