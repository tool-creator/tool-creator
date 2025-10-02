const express = require('express');
const isUnsafe = require('./promptFilter');
const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(express.json());
app.post('/api/validate-prompt', (req, res) => {
    const prompt = req.body.prompt;
    console.log('Received prompt for validation:', prompt);
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({error: 'Invalid prompt'});
    }
    if (isUnsafe(prompt)) {
      return res.status(400).json({error: 'Prompt contains unsafe content' });
    }
    return res.json({success: true})
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
