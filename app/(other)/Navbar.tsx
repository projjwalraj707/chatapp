"use server"
import { redirect } from 'next/navigation'
import { deleteSession, extractPayLoad, getName } from '../lib/session';
import './navbar.css';


export default async function Navbar() {
	async function logout() {
		"use server"
		await deleteSession();
		redirect("/login")
	}
	return (
		<div className="nb-container bold">
			<div className="nb-left">
				<div>ai Messenger</div>
			</div>
			<div className="nb-right">
				<ul className="menu" >
					<li id='menu-item1' className='menu-item'>{(await extractPayLoad()).name}</li>
					<form action={logout}>
						<button className='menu-item button-abled' >Logout</button>
					</form>
				</ul>
			</div>
		</div>
	)
}
