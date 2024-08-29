const express = require("express");
const { get } = require("node:http");

const app = express();
const port = 5001;

const externalApiUrl = "http://localhost:3333/stream/openai-sample";

app.get("/stream", (req, res) => {
	get(externalApiUrl, (externalRes) => {
		externalRes.on("data", (chunk) => {
			res.write(chunk);
		});

		externalRes.on("end", () => {
			res.end();
		});

		externalRes.on("error", (error) => {
			console.error("Error in external API response:", error);
			res.status(500).send("Error in external API response");
		});
	}).on("error", (error) => {
		console.error("Error in fetching external API:", error);
		res.status(500).send("Error in fetching external API");
	});

	res.setHeader("Content-Type", "application/json");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
