import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.MODERATION_API });

app.post("/api/validate-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: prompt,
    });

    const result = response.results[0];

    // If flagged in any category, block it
    if (result.flagged) {
      return res.json({ success: false, error: "Inappropriate or unsafe text detected." });
    }

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: "Server error." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
