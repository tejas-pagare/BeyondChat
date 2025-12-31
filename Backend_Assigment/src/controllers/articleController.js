const Article = require('../models/Article');

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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Public
const createArticle = async (req, res) => {
    try {
        const { title, original_content, original_url, updated_content, references } = req.body;
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
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Public
const updateArticle = async (req, res) => {
    try {
        const { title, original_content, original_url, updated_content, references } = req.body;
        const article = await Article.findById(req.params.id);

        if (article) {
            article.title = title || article.title;
            article.original_content = original_content || article.original_content;
            article.original_url = original_url || article.original_url;
            article.updated_content = updated_content || article.updated_content;
            article.references = references || article.references;

            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Public
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.deleteOne();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
