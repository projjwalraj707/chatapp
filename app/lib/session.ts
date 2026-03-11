"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import client from "./pgsql";

const SECRET_KEY = process.env.JWT_SECRET;

export async function createSession(userID: string, name: string) {
	const expiresAt = new Date(Date.now() + 7*24*60*60*1000); //expire a token in 7 days
	const session = jwt.sign({
		userID,
		name,
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

export async function deleteSession() {
	(await cookies()).delete('session');
}

export async function getName() {
	console.log((await cookies()).get("session")?.value);
	//return (await cookies()).name;
}