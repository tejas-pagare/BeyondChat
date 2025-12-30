const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Article = require('../models/Article');
const { scrapeOldestArticles } = require('../services/scraperService');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('Starting seed process...');

        // Scrape 5 oldest articles
        const articlesData = await scrapeOldestArticles(5);

        if (articlesData.length === 0) {
            console.log('No articles scraped. Check selector logic.');
            process.exit(1);
        }

        console.log(`Scraped ${articlesData.length} articles.`);

        // Clear existing data (optional, or just upsert)
        await Article.deleteMany({});
        console.log('Cleared existing articles.');

        await Article.insertMany(articlesData);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
