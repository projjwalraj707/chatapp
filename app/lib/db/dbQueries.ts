"use server"
import { extractPayLoad } from "../session";
import client from "./pgsql"

export async function doesUsernameExist(username: String) {
	const query = {
		text: 'SELECT COUNT(*) from users where username = $1',
		values: [username]
	}
	const res = await client.query(query);
	if (res.rows[0].count == 0) return 0;
	return 1;
}

export async function usernameToUserID(username: string) {
	const query = {
		text: "SELECT id FROM users WHERE username = $1",
		values: [username]
	}
	const res = await client.query(query);
	return res.rows[0].id;
}

export async function usernameToName(username: string) {
	const query = {
		text: "SELECT name FROM users WHERE username = $1",
		values: [username]
	}
	const res = await client.query(query);
	return res.rows[0].name;
}

export async function createGroup(friends: string[], chatName: string) {
	const groupAdmin = (await extractPayLoad()).username;
	const query = {
		text: "INSERT INTO conversations(convo_name) VALUES($1) RETURNING *",
		values: [friends.length > 1 ? chatName : "Private Chat"]
	}
	const res = await client.query(query);
	const conversation_id = res.rows[0].id;
	for (const member of [...friends, groupAdmin]) {
		const memberId = await usernameToUserID(member);
		const query2 = {
			text: "INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2)",
			values: [conversation_id, memberId]
		}
		await client.query(query2);
	}
}

export async function getConversations() {
	const currentUserID = await usernameToUserID((await extractPayLoad()).username);
	const query = {
		text: "\
		WITH myConversations (conversation_id, convo_name)\
		AS (\
			SELECT c.id, c.convo_name\
			FROM conversations as c\
			LEFT JOIN conversation_members as cm\
				ON c.id = cm.conversation_id\
			WHERE cm.user_id = $1\
		)\
		SELECT mC.convo_name as convo_name, u.username as username\
		FROM myConversations as mC\
		RIGHT JOIN conversation_members as cm\
			ON mC.conversation_id = cm.conversation_id\
		INNER JOIN users as u\
			ON cm.user_id = u.id\
		",
		values: [currentUserID],
	}
	const res = await client.query(query);
	const grouped: {convo_name: string, users: string[]} = res.rows.reduce((acc: Record<string, string[]>, { convo_name, username }: {convo_name: string, username: string}) => {
		if (!acc[convo_name]) acc[convo_name] = [];
		acc[convo_name].push(username);
		return acc;
	}, {} as Record<string, string[]>);

	const ans: {convo_name: string, users: string[]} = Object.entries(grouped).map(([convo_name, users]) => ({
		convo_name,
		users
	}))
	return ans;
}