const express = require("express");
const http = require("node:http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.get("/", (req, res) => {
	res.send("Hello, HTTP!");
});

app.get("/ws-endpoint", (req, res) => {
	if (
		req.headers.upgrade &&
		req.headers.upgrade.toLowerCase() === "websocket"
	) {
		res.connection.upgrade = true;
	} else {
		res.status(426).send("Upgrade Required");
	}
});

server.on("upgrade", (request, socket, head) => {
	const pathname = request.url;

	if (pathname === "/ws-endpoint") {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit("connection", ws, request);
		});
	} else {
		socket.destroy();
	}
});

// WebSocket接続時の処理
wss.on("connection", (ws) => {
	console.log("WebSocket connection established");

	ws.on("message", (message) => {
		console.log(`Received message: ${message}`);
		ws.send(`Server received: ${message}`);
	});

	ws.on("close", () => {
		console.log("WebSocket connection closed");
	});
});

const PORT = 5001
server.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
