const axios = require('axios');

const searchGoogle = async (query) => {
    try {
        const apiKey = process.env.SERPAPI_KEY;
        if (!apiKey || apiKey.startsWith('your_')) {
            console.warn('SerpApi Key is missing or invalid. Returning mock data.');
            return mockSearchResults(query);
        }

        const response = await axios.get('https://serpapi.com/search', {
            params: {
                api_key: apiKey,
                q: query,
                engine: 'google'
            }
        });

        // Extract organic results
        if (response.data.organic_results) {
            // Return top 2 links
            return response.data.organic_results.slice(0, 2).map(r => r.link);
        }

        return [];
    } catch (error) {
        console.error(`Search API Error: ${error.message}`);
        return [];
    }
};

const mockSearchResults = (query) => {
    // Return dummy competitor links if no key provided
    return [
        'https://example.com/competitor-article-1',
        'https://example.com/competitor-article-2'
    ];
};

module.exports = { searchGoogle };
