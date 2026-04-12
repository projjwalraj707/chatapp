"use server"

import { saveMsgToDB } from "../lib/db/dbQueries";
import { saveAIMsgToDB } from "../lib/db/dbQueries";
import { agent } from "../mcp/mcp_client";

export async function sendMsg(previousState: unknown, formData: FormData) {
	const conversation_id = formData.get("conversation_id") as string;
	const isAI = formData.get("isAI") as string === "true";
	const draft = formData.get("draft") as string;
	const currUsername = formData.get("currUsername") as string;
	saveMsgToDB(draft, conversation_id);
	// console.log("Message saved to DB 707:", draft, conversation_id, currUsername, isAI);
	if (isAI) {
		const aiResponse = await agent.invoke({
			messages: [{
				role: "user",
				content: `My username is ${currUsername}. Here is the latest message in our conversation: ${draft}. Please respond to this message in a helpful and informative manner.`
			}]
		})
		console.log("AI Response 707:", aiResponse);
		saveAIMsgToDB(aiResponse.messages.at(-1).content, conversation_id);
	}
}
