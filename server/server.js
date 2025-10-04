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

    const flaggedCategories = Object.entries(result.categories)
      .filter(([_, value]) => value === true)
      .map(([category]) => category);

    if (flaggedCategories.length > 0) {
      return res.json({ success: false, error: "Inappropriate content detected: " + flaggedCategories.join(", ") });
    }

    res.json({ success: true });
  } catch {
    res.json({ success: false, error: "Server error." });
  }
});

app.listen(process.env.PORT || 3000);
