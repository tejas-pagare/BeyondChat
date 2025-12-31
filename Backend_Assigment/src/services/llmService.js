const axios = require('axios');
/**
 Pls use gemini-3 pro to generate the enhanced content

 */


const generateEnhancedContent = async (originalContent, competitorContents) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.startsWith('your_')) {
            console.warn('Gemini Key is missing. Returning mock rewrite.');
            return originalContent + '\n\n[MOCK REWRITE: Active Gemini Key Required]';
        }

        const model = "gemini-2.5-flash"; // Use gemini-1.5-flash for faster/cheaper results
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const prompt = `
        You are an expert SEO content writer.
        Original Article: "${originalContent}"
        
        Competitor Insights:
        ${competitorContents.map((c, i) => `Competitor ${i + 1}: ${c.substring(0, 500)}...`).join('\n')}
        
        Task: Rewrite the original article to be more engaging, comprehensive, and match the style or quality of the competitors. 
        Keep the original meaning but improve flow and SEO.
        `;

        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Gemini's response path: response.data.candidates[0].content.parts[0].text
        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        // Detailed error logging
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(`Gemini API Error: ${errorMessage}`);

        // Try OpenAI as fallback if Gemini fails
        if (error.response?.data?.error?.code === 429) {
            console.log('Attempting OpenAI fallback...');
            try {
                const openaiKey = process.env.OPENAI_API_KEY;
                if (openaiKey && !openaiKey.startsWith('your_')) {
                    const prompt = `
                    You are an expert SEO content writer.
                    Original Article: "${originalContent}"
                    
                    Competitor Insights:
                    ${competitorContents.map((c, i) => `Competitor ${i + 1}: ${c.substring(0, 500)}...`).join('\n')}
                    
                    Task: Rewrite the original article to be more engaging, comprehensive, and match the style or quality of the competitors. 
                    Keep the original meaning but improve flow and SEO.
                    `;

                    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7
                    }, {
                        headers: {
                            'Authorization': `Bearer ${openaiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log('✅ OpenAI fallback successful');
                    return openaiResponse.data.choices[0].message.content;
                }
            } catch (openaiError) {
                console.error('OpenAI fallback also failed:', openaiError.message);
            }
        }

        return originalContent;
    }
};
module.exports = { generateEnhancedContent };
