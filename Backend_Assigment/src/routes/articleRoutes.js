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

router.route('/').get(getArticles).post(validateCreate, createArticle);
router.route('/:id').get(getArticleById).put(validateUpdate, updateArticle).delete(deleteArticle);

module.exports = router;
