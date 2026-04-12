"use client"
import Link from 'next/link';
import Chats from './Chats';
import './chat-screen.css'
import { useEffect, useState } from 'react';
import { getConversations, usernameToName } from '../lib/db/dbQueries';
import { findCurrUser } from '../lib/session';

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

export default function ChatScreen() {
	const [conversations, setConversations] = useState<conversationType[]>([]);
	const [currConvo, setCurrConvo] = useState<conversationType | null>(null);
	const [currUser, setCurrUser] = useState<userType | null>(null)

	useEffect(() => {
		getConversations().then(res => setConversations(res));
		findCurrUser().then(res => setCurrUser(res));
	}, [])

	return (
		<div className="cs-container">
			<div className="cs-contacts-container">
				<ul className='contact-list'>
					<li className='contact'>
						My Conversations 
						<Link href='/new-chat'>
							<img src='/new-chat.png' width='55px' height='60px' alt='create new chat' />
						</Link>
					</li>
					{conversations.sort((a, b) => {
						if (a.users.find(user => user.username === "myai") !== undefined) return -1;
						return 1;
					}).map(conversation =>
						<li onClick={() => setCurrConvo(conversation)} className='contact'>
							<img src={conversation.users.find(user => user.username == "myai") == null ? "blank-dp.png" : "myai.png"}></img>
							{
								conversation.users.length > 2 ? 
								conversation.convo_name
								: conversation.users.find(user => user.username != currUser?.username)?.name
							}
						</li>
					)}
				</ul>
			</div>
			<div className="cs-chats-container">
				{
					currConvo ? 
					<Chats currConvo={currConvo} currUser = {currUser} isAI={currConvo.users.find(user => user.username === "myai") !== undefined} />
					: <div className='chat-alt'> Select a chat to start conversation</div>
				}
			</div>
		</div>
	)
}