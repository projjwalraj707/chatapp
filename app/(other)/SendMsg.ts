"use server"

import { saveMsgToDB } from "../lib/db/dbQueries";

export async function sendMsg(previousState: unknown, formData: FormData) {
	const conversation_id = formData.get("conversation_id") as string;
	const draft = formData.get("draft") as string;
	saveMsgToDB(draft, conversation_id);
	console.log(draft);
	console.log(conversation_id);
}
