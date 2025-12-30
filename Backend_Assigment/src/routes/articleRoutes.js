const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');

router.route('/').get(getArticles).post(createArticle);
router.route('/:id').get(getArticleById).put(updateArticle).delete(deleteArticle);

module.exports = router;
