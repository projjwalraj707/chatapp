"use client"
import { useRouter } from 'next/navigation'
import NewChatComponent from '../../../../components/NewChat'
import '../../chat-screen.css'

export default function NewChat() {
	const router = useRouter();
	return (
		<div
			className="nc-outer-container"
			style={{backgroundColor: "rgba(0,0,0,0.4"}}
			onClick={() => router.back()}
		>
			<NewChatComponent/>
		</div>
	)
}
