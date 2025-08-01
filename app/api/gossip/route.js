import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);

async function getGossipResponse(prompt) {
	try {
		const response = await hf.chatCompletion({
			model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: prompt },
			],
			max_tokens: 1024,
		});
		return response.choices[0].message.content;
	} catch (err) {
		console.error(err.message);
		return "Sorry, I couldn't generate a response at this time.";
	}
}

export async function POST(request) {
	try {
		const { prompt } = await request.json();
		if (!prompt) {
			return new Response(JSON.stringify({ error: "Missing prompt" }), {
				status: 400,
			});
		}
		const content = await getGossipResponse(prompt);
		return new Response(JSON.stringify({ content }), { status: 200 });
	} catch {
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
		});
	}
}
