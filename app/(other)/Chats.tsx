export default function Chats({currConvo, currMembers}: {currConvo: string, currMembers: string[]}) {

	return (
		<>
			<div className="cs-chats-container-inner">
				<div>{currConvo}</div>
				<div>{currMembers.map(ele => <div>{ele}</div>)}</div>
				<div>This is chats</div>
			</div>
			<form className="msg-input-form">
				<input className="msg-input"/>
			</form>
		</>
	)
}
