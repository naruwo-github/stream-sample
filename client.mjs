import { get } from "node:http";
import { TextDecoder } from "node:util";

const url = "http://localhost:5001/stream";
// const url = 'http://localhost:3333/stream-original';

async function fetchAndProcessStream() {
	try {
		get(url, (response) => {
			const decoder = new TextDecoder("utf-8");
			let data = "";

			response.on("data", (chunk) => {
				const decodedChunk = decoder.decode(chunk, { stream: true });
				console.log("Received chunk:", decodedChunk);
				data += decodedChunk;
			});

			response.on("end", () => {
				console.log("Stream complete");
				console.log("Result: ", data);
			});

			response.on("error", (error) => {
				console.error("Stream error:", error);
			});
		});
	} catch (error) {
		console.error("Fetch error:", error);
	}
}

// 非同期関数を実行
fetchAndProcessStream();
