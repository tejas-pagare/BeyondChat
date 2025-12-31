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

const scrapeCompetitorContent = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 10000 // Increased timeout for larger pages
        });

        const $ = cheerio.load(data);

        // 1. Remove non-content elements before extracting text
        $('script, style, nav, footer, header, noscript, iframe, ad').remove();

        // 2. Target common article containers if they exist, otherwise fallback to body
        // This helps avoid sidebar/menu noise
        const contentSelector = 'article, main, .post-content, .entry-content, #content';
        let mainContent = $(contentSelector).text().trim();

        if (!mainContent) {
            mainContent = $('body').text().trim();
        }

        // 3. Clean up the text: Remove extra whitespace and newlines
        const cleanedText = mainContent
            .replace(/\s\s+/g, ' ')      // Replace multiple spaces/tabs with a single space
            .replace(/\n+/g, '\n');      // Keep single newlines but remove excessive ones

        return cleanedText; // Returns the full string without the 2000 char limit

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