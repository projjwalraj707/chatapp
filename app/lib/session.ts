"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET;

export async function createSession(username: string, user_id: string, name: string, email: string) {
	const expiresAt = new Date(Date.now() + 7*24*60*60*1000); //expire a token in 7 days
	const session = jwt.sign({
		username,
		user_id,
		name,
		email,
		expiresAt
	},
	SECRET_KEY,
	{ expiresIn: '7d' });

	const myCookies = await cookies();
	myCookies.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
	})
}

export async function extractPayLoad() {
	try {
		const session = (await cookies()).get("session")?.value;
		const payload = jwt.verify(session, SECRET_KEY);
		return payload;
	}
	catch (err) {
		console.log("Failed to verify token!", err);
	}
}

export async function findCurrUser() {
	const payLoad = await extractPayLoad();
	return {
		username: payLoad.username,
		name: payLoad.name,
		user_id: payLoad.user_id,
	}
}

export async function deleteSession() {
	(await cookies()).delete('session');
}

export async function getName() {
	console.log((await cookies()).get("session")?.value);
	//return (await cookies()).name;
}