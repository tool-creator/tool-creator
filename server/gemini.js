const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`
  const body = {
    contents: [{ parts: [{text: prompt}]}]
  }
  try {
    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    const textResponce = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return textResponce || 'no response text found';
  } catch {
    console.error('gemini api error:', error.response?.data || error.message);
    throw new Error('Failed to fetch from Gemini API');
  }
}
module.exports = callGemini;