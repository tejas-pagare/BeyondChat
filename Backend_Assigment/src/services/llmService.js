const axios = require('axios');

const generateEnhancedContent = async (originalContent, competitorContents) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey.startsWith('your_')) {
            console.warn('OpenAI Key is missing. Returning mock rewrite.');
            return originalContent + '\n\n[MOCK REWRITE: Active OpenAI Key Required]';
        }

        const prompt = `
        You are an expert SEO content writer.
        Original Article: "${originalContent}"
        
        Competitor Insights:
        ${competitorContents.map((c, i) => `Competitor ${i + 1}: ${c.substring(0, 500)}...`).join('\n')}
        
        Task: Rewrite the original article to be more engaging, comprehensive, and match the style or quality of the competitors. 
        Keep the original meaning but improve flow and SEO.
        `;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error(`LLM API Error: ${error.message}`);
        // Fallback or better error handling
        return originalContent;
    }
};

module.exports = { generateEnhancedContent };
