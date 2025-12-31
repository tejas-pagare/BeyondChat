const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Article = require('../models/Article');
const { searchGoogle } = require('../services/searchService');
const { generateEnhancedContent } = require('../services/llmService');
const cheerio = require('cheerio');
const axios = require('axios');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Helper to scrape competitor content
const scrapeCompetitorContent = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }, // Fake UA to avoid simple blocks
            timeout: 5000
        });
        const $ = cheerio.load(data);
        return $('body').text().trim().substring(0, 2000); // Basic textual content
    } catch (error) {
        console.error(`Failed to scrape competitor ${url}: ${error.message}`);
        return '';
    }
};

const enhanceArticles = async () => {
    try {
        await connectDB();

        // 1. Get 5 oldest articles (Assuming created_at ascending)
        // Wait, "oldest" implies earliest date. `sort({ created_at: 1 })`.
        const articles = await Article.find().sort({ created_at: 1 }).limit(5);

        if (articles.length === 0) {
            console.log('No articles found to enhance.');
            return;
        }

        console.log(`Found ${articles.length} articles to enhance.`);

        for (const article of articles) {
            console.log(`\nProcessing: "${article.title}"`);

            // 2. Search for title
            console.log('Searching for competitors...');
            const competitorLinks = await searchGoogle(article.title);

            if (competitorLinks.length === 0) {
                console.log('No competitors found/API issue. Skipping deep scrape.');
            } else {
                console.log(`Found competitors: ${competitorLinks.join(', ')}`);
            }

            // 3. Scrape competitors
            const competitorContents = [];
            for (const link of competitorLinks) {
                const content = await scrapeCompetitorContent(link);
                if (content) competitorContents.push(content);
            }

            // 4. Rewrite content
            console.log('Rewriting content with LLM...');
            const enhancedContent = await generateEnhancedContent(article.original_content, competitorContents);

            // 5. Update DB
            article.updated_content = enhancedContent;
            article.references = competitorLinks;
            await article.save();

            console.log('Article updated successfully.');
        }

        console.log('\nEnhancement process completed.');
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

enhanceArticles();