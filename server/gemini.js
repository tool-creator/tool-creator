const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
function buildPrompt(userPrompt, existingCode = '') {
  return `
Develop complete, well-structured, and properly formatted code for this tool based on the User Prompt and Existing Code provided.
You are operating as part of ToolAI at toolai.us/create/.
Adhere strictly to the specified format and instructions. Any deviation from the required structure will result in a failed validation.
Your response must follow this exact format:
Code:
<full code output>
Explanation for users:
<concise and clear explanation in plain language>
User Prompt:
${userPrompt}
Existing Code:
${existingCode}
`;
}
async function callGemini(userPrompt, existingCode = '') {
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const fullPrompt = buildPrompt(userPrompt, existingCode);
  const body = {
    contents: [{ parts: [{text: fullPrompt}]}]
  }
  try {
    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return textResponse || 'no response text found';
  } catch (error) {
    console.error('gemini api error:', error.response?.data || error.message);
    throw new Error('Failed to fetch from Gemini API');
  }
}
module.exports = callGemini;
