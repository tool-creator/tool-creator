const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log(
  'Gemini key loaded?',
  !!process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY
);
const callGemini = require('./gemini');
const { sanitizeInput } = require('./sanitize');
const htmlSanitize = sanitizeInput;
const express = require('express');
const isUnsafe = require('./promptFilter');
const app = express();
const PORT = 3000;
const fs = require('fs');
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, '../sitemap.xml');
  res.setHeader('Content-Type', 'application/xml');
  fs.createReadStream(sitemapPath).pipe(res);
});
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.post('/api/validate-prompt', async (req, res) => {
  console.log('Route /api/validate-prompt hit');
  const prompt = req.body.prompt;
  console.log('Received prompt for validation:', prompt);
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }
  if (isUnsafe(prompt)) {
    return res.status(400).json({ error: 'Prompt contains unsafe content' });
  }
  try {
    const geminiResponse = await callGemini(prompt);
    const generatedCode = geminiResponse.match(
      /(?<=Code:\s*)(.*?)(?=Explanation for users)/s
    );
    const explanation = geminiResponse.match(
      /(?<=Explanation for users:\s*)(.*)/s
    );
    if (!generatedCode || !explanation) {
      return res.status(400).json({ error: 'Failed to parse AI response' });
    }
    const sanitizedHtml = htmlSanitize(generatedCode[0]);

    return res.json({
      success: true,
      sanitizedHtml,
      explanation: explanation[0],
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res
      .status(500)
      .json({ error: 'Failed to generate response from Gemini' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
