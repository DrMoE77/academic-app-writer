const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/rewrite", async (req, res) => {
    const { text, comments } = req.body;
    const prompt = \`You are an expert academic editor. Based on the following text and reviewer comments, rewrite the text accordingly.\n\nText:\n\${text}\n\nComments:\n\${comments.join('\n')}\`;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an academic writing assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        res.json({ rewritten: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));