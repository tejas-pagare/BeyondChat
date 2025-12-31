const axios = require('axios');
const cheerio = require('cheerio');

const BLOG_URL = 'https://beyondchats.com/blogs/';

const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
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
    const $ = await fetchHTML(url);

    // Title: Based on your provided HTML structure
    let title = $('.elementor-heading-title').first().text().trim();
    if (!title) title = $('h1').first().text().trim();
    console.log(title);
    // Content: Targeting the #content ID you specified
    // We look specifically for the post-content widget inside #content to get cleaner text
    let content = $('#content .elementor-widget-theme-post-content')[0].innerText;
    console.log(content);
    // Fallback if the specific widget isn't found, take everything in #content
    if (!content) content = $('#content').text().trim();

    // Final fallback to common WordPress classes or body
    if (!content) content = $('.entry-content, article').text().trim();
    if (!content) content = $('body').text().trim();

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

        const pageLinks = [];
        // Target common article link structures in Elementor/WordPress
        $('.elementor-post__title a, article h2 a, .entry-title a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && !pageLinks.includes(link)) pageLinks.push(link);
        });

        // Reverse to get oldest first (since lists are usually New -> Old)
        pageLinks.reverse();

        for (const link of pageLinks) {
            if (articlesToScrape.length >= limit) break;
            articlesToScrape.push(link);
        }
        currentPage--;
    }

    console.log(`Found ${articlesToScrape.length} article links. Scraping full content...`);

    const results = [];
    for (const link of articlesToScrape) {
        try {
            console.log(`Scraping: ${link}`);
            const { title, content } = await scrapeArticleContent(link);
            console.log("Scraped content");
            console.log(title);
            console.log(content);
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