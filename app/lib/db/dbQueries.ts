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
	const currentUserID = (await extractPayLoad()).user_id;
	const query = {
		text: "\
		WITH myConversations (conversation_id, convo_name)\
		AS (\
			SELECT c.id, c.convo_name\
			FROM conversations as c\
			INNER JOIN conversation_members as cm\
				ON c.id = cm.conversation_id\
			WHERE cm.user_id = $1\
		)\
		SELECT mC.convo_name as convo_name, mC.conversation_id as conversation_id, u.username as username, u.name as name, u.id as user_id\
		FROM myConversations as mC\
		INNER JOIN conversation_members as cm\
			ON mC.conversation_id = cm.conversation_id\
		INNER JOIN users as u\
			ON cm.user_id = u.id\
		",
		values: [currentUserID],
	}
	const res = await client.query(query);
	const grouped = res.rows.reduce((acc, { conversation_id, convo_name, username, name, user_id }) => {
		if (!acc[conversation_id]) {
			acc[conversation_id] = {
				conversation_id,
				convo_name,
				users: []
			}
		}
		acc[conversation_id].users.push({username, name, user_id});
		return acc;
	}, {} as Record<string, {conversation_id: string, convo_name: string, users: {username: string, name: string, user_id: string}[]}>);
	const ans = Object.values(grouped);
	return ans;
}

export async function saveMsgToDB(draft: string, conversation_id: string) {
	const authorId = (await extractPayLoad()).user_id;
	const  query = {
		text: "\
		INSERT INTO messages (conversation_id, author, content)\
		VALUES ($1, $2, $3)\
		",
		values: [conversation_id, authorId, draft]
	}
	await client.query(query);
}

export async function saveAIMsgToDB(draft: string, conversation_id: string) {
	const aiID = await usernameToUserID("myai");
	const query = {
		text: "\
		INSERT INTO messages (conversation_id, author, content)\
		VALUES ($1, $2, $3)\
		",
		values: [conversation_id, aiID, draft]
	}
	await client.query(query);
}

export async function fetchMessages(conversation_id: string) {
	const query = {
		text: "\
		SELECT u.name as author, m.content, u.username as authorUsername\
		FROM\
			messages as m\
			INNER JOIN conversations as c\
				ON c.id = m.conversation_id\
			INNER JOIN users as u\
				ON m.author = u.id\
		WHERE m.conversation_id = $1\
		ORDER BY m.created_at\
		",
		values: [conversation_id]
	}
	const res = await client.query(query)
	return res.rows;
}

export async function findRecMsgs(username: string, duration: number) {
	const query = {
		text: "\
		WITH myConvo (conversation_id, convo_name)\
		AS (\
			SELECT c.id, c.convo_name\
			FROM conversations as c\
			INNER JOIN conversation_members as cm\
				ON c.id = cm.conversation_id\
			INNER JOIN users as u\
				ON u.id = cm.user_id\
			WHERE u.username = $1\
				AND c.id NOT IN (\
					SELECT conversation_id\
					FROM conversation_members\
					INNER JOIN users\
						ON users.id = conversation_members.user_id\
					WHERE users.username = 'myai'\
				)\
		)\
		SELECT m.content as msg, mC.convo_name, u.username as msg_author_username, u.name msg_author_name\
		FROM messages as m\
		INNER JOIN myConvo as mC\
			ON mC.conversation_id = m.conversation_id\
		INNER JOIN users as u\
			ON u.id = m.author\
		WHERE m.created_at >= NOW() - ($2 * INTERVAL '1 hour')\
		",
		values: [username, duration]
	}
	return (await client.query(query)).rows;
}
