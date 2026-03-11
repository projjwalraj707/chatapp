import './chat-screen.css'

export default function ChatScreen() {
	const contacts = ['Trumph', 'Jefferey', 'Gates', 'Mamdani'];
	const messages = ['Hi', "How are you?", 'I am fine'];
	return (
		<div className="cs-container">
			<div className="cs-contacts-container">
				<ul className='contact-list'>
					<li className='contact'>My Contacts</li>
					{contacts.map(contact =>
						<li className='contact'> {contact} </li>
					)}
				</ul>
			</div>
			<div className="cs-chats-container">
				<ul className='msgs'>
					{messages.map(msg => <li className='msg'>
						{msg}
					</li>)}
				</ul>
			</div>
		</div>
	)
}