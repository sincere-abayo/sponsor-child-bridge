const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/receivers', require('./routes/receivers'));
app.use('/api/sponsorships', require('./routes/sponsorships'));
app.use('/api/confirmations', require('./routes/confirmations'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;