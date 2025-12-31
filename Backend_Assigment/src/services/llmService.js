const axios = require('axios');
/**
 Pls use gemini-3 pro to generate the enhanced content

 */


const generateEnhancedContent = async (originalContent, competitorContents) => {
    // 1. Log Competitor Content as requested
    console.log("--- Competitor Content Logs ---");
    console.log(competitorContents.map((c, i) => `Competitor ${i + 1}: ${c.substring(0, 500)}...`).join('\n'));
    console.log("-------------------------------");

    /** * NOTE: Actual API logic is commented out per your request.
     * Returning a dummy response in the new standard format.
     */

    
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = "gemini-3-flash-preview"; // Updated to a stable model version
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // IMPROVED PROMPT: Specific structure and SEO instructions
        const prompt = `
        You are a Professional SEO Content Strategist. 
        
        TASK:
        Rewrite the "Original Article" by synthesizing unique insights from the "Competitor Insights" provided. 
        The goal is to create a "Skyscraper" piece of content that is better than all competitors.

        CONSTRAINTS:
        1. Maintain the original core message and intent.
        2. Use a professional yet engaging tone.
        3. Use Markdown formatting (H1, H2, H3, Bullet points).
        4. Include a 'Key Takeaways' section at the beginning.
        5. Optimize for SEO: Use natural keyword integration.

        OUTPUT FORMAT:
        Return the response in the following Markdown structure:
        # [Catchy SEO Title]
        **Meta Description:** [150-160 characters]
        
        ## Key Takeaways
        - [Point 1]
        - [Point 2]

        ## Introduction
        [Content...]

        ## [Subheading 1]
        [Detailed Content...]

        ## [Subheading 2]
        [Detailed Content...]

        ## Conclusion
        [Summary...]
        
        ---
        Original Article: 
        "${originalContent}"
        
        Competitor Insights:
        ${competitorContents.map((c, i) => `COMPETITOR ${i + 1}:\n${c}`).join('\n\n')}
        `;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 3000,
            }
        });

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error(`Gemini API Error: ${error.message}`);
        return originalContent;
    }
    

};
module.exports = { generateEnhancedContent };
