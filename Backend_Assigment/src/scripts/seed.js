const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db'); // Ensure this points to your DB config
const Article = require('../models/Article');
const { scrapeOldestArticles } = require('../services/scraperService');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('Database connected. Starting scrape...');

        // Scrape 5 oldest articles using the updated selectors
        const articlesData = await scrapeOldestArticles(5);
        console.log(articlesData);
        if (articlesData.length === 0) {
            console.log('No articles found. Check selectors.');
            process.exit(1);
        }

        // Clear existing articles to avoid duplicates (optional)
        await Article.deleteMany({});
        console.log('Cleared existing articles.');

        // Insert the newly scraped articles into the database
        await Article.insertMany(articlesData);

        console.log(`${articlesData.length} articles successfully stored in the database!`);
        process.exit();
    } catch (error) {
        console.error(`Error during seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();