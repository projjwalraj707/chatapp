"use client"
import Link from 'next/link';
import Chats from './Chats';
import './chat-screen.css'
import { useEffect, useState } from 'react';
import { getConversations } from '../lib/db/dbQueries';

export default function ChatScreen() {
	const [conversations, setConversations] = useState<{convo_name: string, users: string[]}[]>([]);
	const [currConvo, setCurrConvo] = useState("");
	const [currMembers, setCurrMembers] = useState([]);
	useEffect(() => {
		getConversations().then(res => setConversations(res));
	}, [])
	function selectConvo(e) {
		setCurrConvo(e.target.id)
		setCurrMembers(conversations.find(ele => ele.convo_name == e.target.id)?.users)
	}
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
					{conversations.map(conversation =>
						<li onClick={selectConvo} id={conversation.convo_name} className='contact'> {conversation.convo_name} </li>
					)}
				</ul>
			</div>
			<div className="cs-chats-container">
				<Chats currConvo={currConvo} currMembers = {currMembers} />
			</div>
		</div>
	)
}