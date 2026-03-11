"use client";
import { useFormStatus } from "react-dom";

export default function Submit() {
	const { pending } = useFormStatus();
	return (
		<button className={`submit-button ${pending ? "button-disabled" : "button-abled"}`} type='submit' disabled={pending}>
			{pending ? "Submitting..." : "Submit"}
		</button>
	)
}
