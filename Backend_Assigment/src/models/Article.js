const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    original_content: {
        type: String,
        required: true
    },
    original_url: {
        type: String,
        required: true,
        unique: true
    },
    updated_content: {
        type: String
    },
    references: [{
        type: String
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Article', ArticleSchema);
