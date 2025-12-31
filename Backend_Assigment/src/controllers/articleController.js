const Article = require('../models/Article');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
    try {
        console.log('📥 GET /api/articles - Fetching all articles...');
        const articles = await Article.find()
            .sort({ created_at: -1 })
            .select('-__v') // Exclude version field
            .lean() // Return plain JS objects for better performance
            .exec();
        console.log(`✅ Found ${articles.length} articles`);
        res.json(articles);
    } catch (error) {
        console.error('❌ Error fetching articles:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles',
            error: error.message
        });
    }
};

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.json(article);
    } catch (error) {
        console.error('❌ Error fetching article:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch article',
            error: error.message
        });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Public
const createArticle = async (req, res) => {
    try {
        const { title, original_content, original_url, updated_content, references } = req.body;

        // Additional validation: Check for duplicate URL
        const existingArticle = await Article.findOne({ original_url });
        if (existingArticle) {
            return res.status(409).json({
                success: false,
                message: 'An article with this URL already exists'
            });
        }

        const article = new Article({
            title,
            original_content,
            original_url,
            updated_content,
            references
        });

        const createdArticle = await article.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        console.error('❌ Error creating article:', error.message);
        res.status(400).json({
            success: false,
            message: 'Failed to create article',
            error: error.message
        });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Public
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, original_content, original_url, updated_content, references } = req.body;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check for duplicate URL if updating original_url
        if (original_url !== undefined && original_url !== article.original_url) {
            const duplicate = await Article.findOne({
                original_url,
                _id: { $ne: id }
            });
            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: 'Another article with this URL already exists'
                });
            }
        }

        // Update only provided fields
        if (title !== undefined) article.title = title;
        if (original_content !== undefined) article.original_content = original_content;
        if (original_url !== undefined) article.original_url = original_url;
        if (updated_content !== undefined) article.updated_content = updated_content;
        if (references !== undefined) article.references = references;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } catch (error) {
        console.error('❌ Error updating article:', error.message);
        res.status(400).json({
            success: false,
            message: 'Failed to update article',
            error: error.message
        });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Public
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        await article.deleteOne();
        res.json({
            success: true,
            message: 'Article removed successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting article:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to delete article',
            error: error.message
        });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
