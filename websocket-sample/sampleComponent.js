import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
	const [message, setMessage] = useState("");
	const [input, setInput] = useState("");
	const [ws, setWs] = useState(null);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:5001/ws-endpoint");

		socket.onopen = () => {
			console.log("Connected to server");
		};

		socket.onmessage = (event) => {
			console.log(`Message from server: ${event.data}`);
			setMessage(event.data);
		};

		socket.onclose = () => {
			console.log("Disconnected from server");
		};

		socket.onerror = (error) => {
			console.error(`WebSocket error: ${error}`);
		};

		setWs(socket);

		return () => {
			socket.close();
		};
	}, []);

	const sendMessage = () => {
		if (ws) {
			ws.send(input);
			setInput("");
		}
	};

	return (
		<div>
			<h1>WebSocket Client</h1>
			<div>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message"
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
			<div>
				<p>Message from server: {message}</p>
			</div>
		</div>
	);
};

export default WebSocketComponent;
