const callGemini = require('./gemini');
require('dotenv').config();
const express = require('express');
const path = require('path');
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
    return res.json({ success: true, response: geminiResponse });
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
