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
						{state?.errors.name && (<span className='text-red-500 bold'>: {state.errors.name[0]}</span>)}
						<br/>
						<input name='name' type='text' defaultValue={state?.formData.name} placeholder='Enter your Full Name'/> <br/>
					</label>

					<label>Email 
						{state?.errors.email && (<span className='text-red-500 bold'>: {state.errors.email[0]}</span>)}
						<br/>
						<input name='email' type='email' defaultValue={state?.formData.email} placeholder='Enter your Email'/> <br/>
					</label>

					<label>Username 
						{state?.errors.username && (<span className='text-red-500 bold'>: {state.errors.username[0]}</span>)}
						<br/>
						<input name='username' type='text' defaultValue={state?.formData.username} placeholder='Enter your Username'/> <br/>
					</label>

					<label>Password 
						{state?.errors.password && (<span className='text-red-500 bold'>: {state.errors.password[0]}</span>)}
						<br/>
						<input name='password' type='password' defaultValue={state?.formData.password} placeholder='Enter Your Password'/> <br/>
					</label>

					<label>Confirm Password 
						{state?.errors.confirmPassword && (<span className='text-red-500 bold'>: {state.errors.confirmPassword[0]}</span>)}
						<br/>
						<input name='confirmPassword' type='password' defaultValue={state?.formData.confirmPassword} placeholder='Confirm your Password'/> <br/>
					</label>

					<div className='divider'></div>
					{state?.errors.generalError && (<span className='text-red-500 bold'>: {state.errors.generalError[0]}</span>)}
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
