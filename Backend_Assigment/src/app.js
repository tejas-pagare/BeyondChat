const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`🔵 ${req.method} ${req.url}`);
    next();
});

// Routes (to be imported later)
app.use('/api/articles', require('./routes/articleRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
