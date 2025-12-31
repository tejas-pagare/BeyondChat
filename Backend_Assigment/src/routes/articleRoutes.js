const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');
const { validateCreate, validateUpdate } = require('../middleware/validation');
const { writeApiLimiter } = require('../middleware/rateLimiter');

// GET routes (read operations) - no extra rate limiting
router.get('/', getArticles);
router.get('/:id', getArticleById);

// POST/PUT/DELETE routes (write operations) - stricter rate limiting
router.post('/', writeApiLimiter, validateCreate, createArticle);
router.put('/:id', writeApiLimiter, validateUpdate, updateArticle);
router.delete('/:id', writeApiLimiter, deleteArticle);

module.exports = router;
