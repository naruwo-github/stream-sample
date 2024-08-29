const express = require("express");
const { Readable } = require("node:stream");

const app = express();
const port = 3333;

const sampleData = [
	{ id: 1, title: "Post 1", body: "This is the first post" },
	{ id: 2, title: "Post 2", body: "This is the second post" },
	{ id: 3, title: "Post 3", body: "This is the third post" },
	{ id: 4, title: "Post 4", body: "This is the fourth post" },
	{ id: 5, title: "Post 5", body: "This is the fifth post" },
];

app.get("/stream-original", (req, res) => {
	const readable = new Readable({
		read() {
			this.push(JSON.stringify(sampleData[0]));
			this.push(JSON.stringify(sampleData[1]));
			this.push(JSON.stringify(sampleData[2]));
			this.push(null); // データの終わりを示す
		},
	});

	res.setHeader("Content-Type", "application/json");
	readable.pipe(res);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
