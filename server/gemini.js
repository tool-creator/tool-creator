const axios = require('axios');
function buildPrompt(userPrompt, existingCode = '') {
  return `
You are an expert web developer and educator. When given a prompt, you will generate a complete HTML/CSS/JS snippet that can be previewed in a browser.

Your response must follow this exact format:

Code: <your HTML/CSS/JS code here>

Explanation for users: A clear explanation of what the code does and how it works.

⚠️ Important rules:
- Do NOT use inline event handlers like onclick, onmouseover, etc.
- Instead, use <script> tags and bind events using document.getElementById or querySelector.
- Only use iframes from trusted sources: https://www.youtube.com, https://player.vimeo.com, or https://toolai.us
- Do NOT include <script src="..."> from unknown or external domains.
- Avoid using <object>, <embed>, <link>, <meta>, or <base> tags.
- Do NOT include inline <style> or <script> inside attributes.
- Keep your code clean, semantic, and safe for previewing in a sandboxed iframe.

Here is the user prompt:
${userPrompt}
Here is any existing code to build upon if any exists:
${existingCode}
`;
}
async function callGemini(userPrompt, existingCode = '') {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log('Using Gemini key:', GEMINI_API_KEY);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  console.log('Posting to Gemini:', url);
  const fullPrompt = buildPrompt(userPrompt, existingCode);
  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
  };
  try {
    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return textResponse || 'no response text found';
  } catch (error) {
    console.error('gemini api error:', error.response?.data || error.message);
    throw new Error('Failed to fetch from Gemini API');
  }
}
module.exports = callGemini;
