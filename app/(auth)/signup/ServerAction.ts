"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "../../lib/session";
import client from "../../lib/db/pgsql";

const FormDataSchema = z.object({
	name: z.string().trim()
		.min(3, {message: "too short"})
		.max(20, {message: "too long"}),
	email: z.email("Invalid Email"),
	username: z.string().trim()
		.min(3, { message: "too short"})
		.max(20, { message: "too long"}),
	password: z.string().trim()
		.min(3, { message: "too short"})
		.max(20, { message: "too long"}),
	confirmPassword: z.string().trim()
		.min(3, { message: "too short"})
		.max(20, { message: "too long"})
}).refine((data) => data.password.trim() === data.confirmPassword.trim(), {
	message: "Passwords do not match",
	path: ["password", "confirmPassword"],
})

export default async function submitForm (previousState: unknown, formData: FormData) {
	const parsedData = FormDataSchema.safeParse(Object.fromEntries(formData))
	if (!parsedData.success) {
		return {
			errors: z.flattenError(parsedData.error).fieldErrors,
			formData: Object.fromEntries(formData.entries()),
		}
	}
	if ((await client.query('select count(*) from users where username = $1', [parsedData.data.username])).rows[0].count != '0') {
		return { 
			errors: { username: ['already taken'] },
			formData: Object.fromEntries(formData.entries()),
		}
	}
	if ((await client.query('select count(*) from users where email = $1', [parsedData.data.email])).rows[0].count != '0') {
		return {
			errors: { email: ['already taken'] },
			formData: Object.fromEntries(formData.entries()),
		}
	}
	let user_id: string = "";
	try {
		const query = {
			text: 'INSERT INTO users (username, name, email, hashed_password)\
			VALUES ($1, $2, $3, $4)\
			RETURNING *',
			values: [parsedData.data.username, parsedData.data.name, parsedData.data.email, parsedData.data.password],
		}
		const res = await client.query(query);
		user_id = res.rows[0].id;
		console.log("singup result:")
		console.log(res)
	}
	catch {
		return {
			errors: { generalError: ['something went wrong!'] },
			formData: Object.fromEntries(formData.entries()),
		}
	}
	await createSession(parsedData.data.username, user_id, parsedData.data.name, parsedData.data.email);
	redirect("/")
}