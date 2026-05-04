"use server"

import { saveMsgToDB } from "../lib/db/dbQueries";
import { saveAIMsgToDB } from "../lib/db/dbQueries";
import { agent } from "../mcp/mcp_client";

export async function sendMsg(previousState: unknown, formData: FormData) {
	const conversation_id = formData.get("conversation_id") as string;
	const draft = formData.get("draft") as string;
	try {
		await saveMsgToDB(draft, conversation_id);
		return draft;
	}
	catch (err) {
		console.error("Error saving message to DB:", err);
		throw new Error("Failed to save message. Please try again.");
	}
}

export async function receiveAIMsg(username: string, name: string, draft: string, conversation_id: string) {
	const aiResponse = await agent.invoke({
		messages: [{
			role: "user",
			content: `(Context: Name and username of the person who is asking query: ${username}, ${name}. You may or may not need the context or tools to provide a helpful response.) The Query: ${draft}. `
		}]
	})
	console.log("AI Response:", aiResponse);
	const aiMsgContent = aiResponse.messages.at(-1).content;
	await saveAIMsgToDB(aiMsgContent, conversation_id);
	return aiMsgContent;
}
