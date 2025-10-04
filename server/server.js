import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.MODERATION_API, // Store your key in an environment variable
});

app.post('/api/validate-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call OpenAI's Moderation API
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: prompt
    });

    const result = response.results[0];

    if (result.flagged) {
      res.json({ success: false, error: 'Prompt violates moderation rules.' });
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: 'Server error.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
