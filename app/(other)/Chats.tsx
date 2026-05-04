"use client"
import { useActionState, useEffect, useRef, useState } from "react"
import { receiveAIMsg, sendMsg } from "./SendMsg";
import { fetchMessages } from "../lib/db/dbQueries";
import { Socket } from "socket.io-client";


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

export default function Chats({ currConvo, currUser, isAI, socket }: { currConvo: conversationType, currUser: userType | null, isAI: boolean, socket: Socket }) {
	const [messages, setMessages] = useState<{ author: string, authorusername: string, content: string }[]>([])
	const [state, actionsFunc, isPending] = useActionState(sendMsg, undefined);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchMessages(currConvo.conversation_id).then(res => {
			setMessages(res);
		});
	}, [currConvo.conversation_id]);

	useEffect(() => {
		if (!socket) return;

		const handleReceiveMessage = (data: any) => {
			// Only add if it's for the current conversation AND not from the current user
			// (to avoid duplicates, since we add our own messages locally for responsiveness)
			if (data.room === currConvo.conversation_id && data.authorusername !== currUser?.username) {
				setMessages(prev => [...prev, {
					author: data.author,
					authorusername: data.authorusername,
					content: data.content
				}]);
			}
		};

		socket.on("receive_message", handleReceiveMessage);
		return () => {
			socket.off("receive_message", handleReceiveMessage);
		};
	}, [socket, currConvo.conversation_id, currUser?.username]);

	useEffect(() => {
		if (state) {
			setMessages(prev => [...prev, { author: currUser?.name || "Unknown", authorusername: currUser?.username || "unknown", content: state }])
			if (isAI) {
				receiveAIMsg(currUser?.username || "unknown", currUser?.name || "Unknown", state, currConvo.conversation_id).then(aiMsgContent => {
					setMessages(prev => [...prev, { author: "My AI Assistant", authorusername: "myai", content: aiMsgContent }]);
				});
			}
		}
	}, [state])

	useEffect(() => {
		containerRef.current?.scrollTo({
			top: containerRef.current.scrollHeight,
			behavior: 'smooth'
		});
	}, [messages]);
	return (
		<>
			<div className="cs-chats-container-inner" ref={containerRef}>
				{
					messages.map(msg =>
						<div className={msg.authorusername == currUser?.username ? "msg-container self-msg" : "msg-container other-msg"}>
							<div className="msg"> <span className="msg-author">{msg.author}</span> <br /> {msg.content} </div>
						</div>
					)
				}
			</div>
			<form action={actionsFunc} className="msg-input-form">
				<input type='text' name="draft" className="msg-input" placeholder={isPending ? "Sending..." : "Enter your message here"} />
				<input type="hidden" name="conversation_id" value={currConvo.conversation_id} ></input>
				<input type="hidden" name="isAI" value={isAI.toString()} ></input>
				<input type="hidden" name="currUsername" value={currUser?.username} ></input>
				<input type="hidden" name="currName" value={currUser?.name} ></input>
				<button className="send-button" type="submit" disabled={isPending}>
					<img className="send-button-img" src='/send-msg.png' alt='send message button' />
				</button>
			</form>
		</>
	)
}
