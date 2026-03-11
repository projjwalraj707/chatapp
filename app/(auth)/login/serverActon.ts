'use server';
import { z } from 'zod';
import client from '../../lib/pgsql';
import { createSession } from '../../lib/session';
import { redirect } from 'next/navigation';

const FormDataSchema = z.object({
	username: z.string().trim()
		.min(3, { message: "too short"})
		.max(20, { message: "too long"}),
	password: z.string().trim()
		.min(3, { message: "too short"})
		.max(20, { message: "too long"}),
});

export default async function submitForm(previousState: unknown, formData: FormData) {
	const parsedData = FormDataSchema.safeParse(Object.fromEntries(formData));
	if (!parsedData.success) {
		return {
			errors: z.flattenError(parsedData.error).fieldErrors,
			formData: Object.fromEntries(formData.entries()),
		}
	}
	const res = await client.query('select * from users where username = $1', [parsedData.data.username]);
	console.log(res.rows);
	if (res.rows.length == 0) return {
		errors: { username: ["doesn't exist"] },
		formData: Object.fromEntries(formData.entries()),
	}
	if (res.rows[0].hashed_password != parsedData.data.password) return {
		errors: { username: ["wrong entry"], password: ["wrong entry"]},
		formData: Object.fromEntries(formData.entries()),
	}
	await createSession(parsedData.data.username, res.rows[0].name);
	redirect("/")
}