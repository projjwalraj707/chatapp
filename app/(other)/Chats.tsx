"use client"
import { useActionState, useEffect, useState } from "react"
import { sendMsg } from "./SendMsg";
import { fetchMessages } from "../lib/db/dbQueries";

type userType = {
	username: string,
	name: string,
	user_id: string,
}

type conversationType = {
	conversation_id: string,
	convo_name: string,
	users: userType[]
}

export default function Chats({ currConvo, currUser }: { currConvo: conversationType, currUser: userType | null }) {
	const [messages, setMessages] = useState<{author: string, authorusername: string, content: string}[]>([])
	const [state, actionsFunc, isPending] = useActionState(sendMsg, undefined);
	useEffect(() => {
		fetchMessages(currConvo.conversation_id).then(res => {
			setMessages(res);
		});
	}, [currConvo.conversation_id]);
	return (
		<>
			<div className="cs-chats-container-inner">
				{
					messages.map(msg =>
						<div className={msg.authorusername == currUser?.username ? "msg-container self-msg": "msg-container other-msg"}>
							<div className="msg"> <span className="msg-author">{msg.author}</span> <br/> {msg.content} </div>
						</div>
					)
				}
			</div>
			<form action={actionsFunc} className="msg-input-form">
				<input type='text' name="draft" className="msg-input" placeholder="Enter your message here"/>
				<input type="hidden" name="conversation_id" value={currConvo.conversation_id} ></input>
				<button className="send-button" type="submit" disabled={isPending}>
					<img className="send-button-img" src='/send-msg.png' alt='send message button' />
				</button>
				{/* <button>Submit</button> */}
			</form>
		</>
	)
}
