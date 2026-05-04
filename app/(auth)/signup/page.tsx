"use client"
import Link from 'next/link';
import '../login-signup.css';
import { useActionState } from 'react';
import submitForm from './ServerAction'

export default function Signup() {
	const [state, actionFunc, isPending] = useActionState(submitForm, undefined);
	return (
		<div className="ls-container-outer">
			<div className='ls-container-inner'>
				<div className='bold'>Signup</div>
				<div className='divider'></div>
				<form action={actionFunc}>
					<label>Name
						{(state?.errors as any)?.name && (<span className='text-red-500 bold'>: {(state?.errors as any).name[0]}</span>)}
						<br />
						<input name='name' type='text' defaultValue={state?.formData.name as string} placeholder='Enter your Full Name' /> <br />
					</label>

					<label>Email
						{(state?.errors as any)?.email && (<span className='text-red-500 bold'>: {(state?.errors as any).email[0]}</span>)}
						<br />
						<input name='email' type='email' defaultValue={state?.formData.email as string} placeholder='Enter your Email' /> <br />
					</label>

					<label>Username
						{(state?.errors as any)?.username && (<span className='text-red-500 bold'>: {(state?.errors as any).username[0]}</span>)}
						<br />
						<input name='username' type='text' defaultValue={state?.formData.username as string} placeholder='Enter your Username' /> <br />
					</label>

					<label>Password
						{(state?.errors as any)?.password && (<span className='text-red-500 bold'>: {(state?.errors as any).password[0]}</span>)}
						<br />
						<input name='password' type='password' defaultValue={state?.formData.password as string} placeholder='Enter Your Password' /> <br />
					</label>

					<label>Confirm Password
						{(state?.errors as any)?.confirmPassword && (<span className='text-red-500 bold'>: {(state?.errors as any).confirmPassword[0]}</span>)}
						<br />
						<input name='confirmPassword' type='password' defaultValue={state?.formData.confirmPassword as string} placeholder='Confirm your Password' /> <br />
					</label>

					<div className='divider'></div>
					{(state?.errors as any)?.generalError && (<span className='text-red-500 bold'>{(state?.errors as any).generalError[0]}</span>)}
					<div className='button-container'>
						<button className={`submit-button ${isPending ? "button-disabled" : "button-abled"}`} type='submit' disabled={isPending}>
							{isPending ? "Submitting..." : "Submit"}
						</button>
					</div>
					<Link className='login-signup-toggle' href='/login'>Already have an account? Login</Link>
				</form>
			</div>
		</div>
	)
}
