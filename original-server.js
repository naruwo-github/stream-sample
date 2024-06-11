const express = require("express");
const { Readable } = require("node:stream");

const app = express();
const port = 3333;

// サンプルデータ
const sampleData = [
	{ id: 1, title: "Post 1", body: "This is the first post" },
	{ id: 2, title: "Post 2", body: "This is the second post" },
	{ id: 3, title: "Post 3", body: "This is the third post" },
];

// ストリームを使ってデータを送信するエンドポイント
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

// サーバーを起動
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
