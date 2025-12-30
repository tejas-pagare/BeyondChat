const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const BLOG_URL = 'https://beyondchats.com/blogs/';

const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        throw error;
    }
};

const getLastPageNumber = async () => {
    const $ = await fetchHTML(BLOG_URL);
    let maxPage = 1;
    $('.page-numbers').each((i, el) => {
        const num = parseInt($(el).text());
        if (!isNaN(num) && num > maxPage) {
            maxPage = num;
        }
    });
    return maxPage;
};

const scrapeArticleContent = async (url) => {
    // Basic selector logic - may need adjustment based on creating a robust generic scraper or this specific site
    const $ = await fetchHTML(url);
    const title = $('h1').text().trim();
    // Usually content is in a specific div. I'll guess standard selectors or dump generic p's
    // Inspecting via assumption: commonly .entry-content or article
    let content = $('.entry-content, article').text().trim();
    if (!content) content = $('body').text().trim().substring(0, 1000); // Fallback

    return { title, content };
};

const scrapeOldestArticles = async (limit = 5) => {
    const lastPage = await getLastPageNumber();
    console.log(`Last page found: ${lastPage}`);

    let articlesToScrape = [];
    let currentPage = lastPage;

    while (articlesToScrape.length < limit && currentPage > 0) {
        const url = currentPage === 1 ? BLOG_URL : `${BLOG_URL}page/${currentPage}/`;
        console.log(`Scraping list page: ${url}`);
        const $ = await fetchHTML(url);

        // Items usually in .post or article tag.
        // Based on markdown viewed earlier, they are listed.
        // I need to reverse the list on the page because the page itself processes New -> Old (top to bottom).
        // BUT the LAST page has the OLDEST articles.
        // On the LAST page, the articles at the BOTTOM are the absolute oldest? 
        // Or usually blogs show New -> Old. 
        // Page 1: 2024 (Nov, Oct...)
        // Page 15: 2021 (Jan...)
        // On Page 15, the top is Jan 2021, bottom is Dec 2020? No, usually Top is newer than Bottom.
        // So the absolute oldest is the LAST item on the LAST page.

        const pageLinks = [];
        $('.div-archive-post a.link, article h2 a').each((i, el) => { // Selectors guessed, will need to be robust
            const link = $(el).attr('href');
            if (link && !pageLinks.includes(link)) pageLinks.push(link);
        });

        // If I assume top is newer, then correct order on page is Top->Bottom = New->Old.
        // So the bottom-most item is older.
        // So I should take items from the end of the list.

        pageLinks.reverse(); // Now: [Oldest, ..., NewestOnPage]

        for (const link of pageLinks) {
            if (articlesToScrape.length >= limit) break;
            articlesToScrape.push(link);
        }

        currentPage--;
    }

    console.log(`Found ${articlesToScrape.length} article links. Scraping content...`);

    const results = [];
    for (const link of articlesToScrape) { // specific order: oldest first now
        try {
            console.log(`Scraping content: ${link}`);
            const { title, content } = await scrapeArticleContent(link);
            results.push({
                title,
                original_content: content,
                original_url: link,
                updated_content: null,
                references: []
            });
        } catch (e) {
            console.error(`Failed to scrape ${link}: ${e.message}`);
        }
    }

    return results;
};

module.exports = { scrapeOldestArticles };
