'use client'
import { useState } from "react"
import { createGroup, doesUsernameExist } from "../app/lib/db/dbQueries";
import { extractPayLoad } from "../app/lib/session";
import { useRouter } from "next/navigation";

export default function NewChatComponent() {
	const [usernames, setUsernames] = useState<string[]>([]);
	const [username, setUsername] = useState<string>("");
	const [chatName, setChatName] = useState<string>("");
	const [errors, setErrors] = useState<{username?: string, chatName?: string}>();
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	function handleUsernameChange(e) {
		const val = e.target.value;
		setUsername(val);
	}
	function handleChatName(e) {
		const val = e.target.value;
		setChatName(val);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (usernames.length == 0) {
			setErrors(prev => ({ ...prev, username: "can't be empty"}))
			return;
		}
		setIsPending(true);
		if (usernames.length >= 2 && !chatName.length) {
			setErrors(prev => ({...prev, chatName: "can't be empty!"}))
			setIsPending(false);
			return;
		}
		await createGroup(usernames, usernames.length > 1 ? chatName : "");
		setIsPending(false);
		router.back();
	}
	async function handleKeyDown(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			const currentUsername = username.trim();
			if (!currentUsername.length) return;
			setErrors(prev => ({...prev, username: ""}))
			if ((await extractPayLoad()).username === currentUsername) {
				setErrors(prev => ({...prev, username: "can't add yourself"}))
				return;
			}
			if (!(await doesUsernameExist(currentUsername))) {
				setErrors(prev => ({...prev, username: "not found!"}))
				return;
			}
			if (usernames.includes(currentUsername)) {
				setErrors(prev => ({...prev, username: "already included!"}))
				return;
			}
			setUsernames(prev => [...prev, currentUsername]);
			setUsername("");
		}
	}

	return (
		<div className="nc-inner-container" onClick={(e) => e.stopPropagation()}>
			<div className="bold">Initiate a new personal or group chat</div>
			<div className="divider"></div>
			<form onSubmit={handleSubmit}>
				<label>Add participant(s):
					{ errors?.username && <span className="text-red-500 bold"> {errors.username}</span> }
					<br/>
					<input name="participant" value={username}
						onChange={handleUsernameChange}
						onKeyDown={handleKeyDown}
						placeholder={"Enter comma separated usernames"}
					/> <br/>
					{usernames.map((u, i) => (
						<span key={i} className="px-2 py-1 rounded bg-green-600 mr-1 mb-2" >
							{u}
						</span>
					))}
					{usernames.length > 0 && <br/>}
				</label>
				{usernames.length > 1 && 
					<label>Group name:
						{ errors?.chatName && <span className="text-red-500 bold"> {errors.chatName}</span> }
						<br/>
						<input name='chatName' value={chatName} onChange={handleChatName} placeholder="Assign a name to the group"/> <br/>
					</label>
				}
				<div className="divider"></div>
				<div className="button-container">
					<button className={isPending ? "button-disabled" : "button-abled"}>
						{isPending ? "Loading..." : "Create new chat"}
					</button>
				</div>
			</form>
		</div>
	)
}
