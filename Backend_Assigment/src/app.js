const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const sanitizeInput = require('./middleware/sanitize');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(morgan('dev'));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Sanitize input to prevent NoSQL injection
app.use(sanitizeInput);

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`🔵 ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/articles', require('./routes/articleRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
