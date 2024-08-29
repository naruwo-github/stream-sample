const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/stream/openai-sample", async (req, res) => {
	const { messages, model = "gpt-3.5-turbo" } = req.body;
	if (!messages || !Array.isArray(messages)) {
		res.status(400).json({ error: "Invalid request body" });
		return;
	}

	try {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();

		const stream = await openai.chat.completions.create({
			model,
			messages,
			stream: true,
		});

		for await (const chunk of stream) {
			if (chunk.choices[0].delta.content) {
				res.write(`data: ${JSON.stringify(chunk)}\n\n`);
			}
		}

		res.write("data: [DONE]\n\n");
		res.end();
	} catch (error) {
		console.error("Error fetching OpenAI data:", error);
		res.write(
			`data: ${JSON.stringify({ error: "Error fetching OpenAI data" })}\n\n`,
		);
		res.end();
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
