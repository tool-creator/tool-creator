import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.MODERATION_API,
});

app.post("/api/validate-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: prompt,
    });

    const result = response.results[0];

    if (result.flagged) {
      res.json({ success: false, error: "Inappropriate or unsafe text detected." });
    } else {
      res.json({ success: true });
    }
  } catch {
    res.json({ success: false, error: "Server error." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
