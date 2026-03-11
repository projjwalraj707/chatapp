"use client";
import Link from 'next/link'
import '../login-signup.css'
import { redirect } from 'next/navigation'
import Submit from '@/components/Submit';
import { z } from 'zod';
import { useActionState } from 'react';
import submitForm from './serverActon';

export default function Login() {
	const [state, actionFunc, isPending] = useActionState(submitForm, undefined);

	return (
		<div className="ls-container-outer">
			<div className='ls-container-inner'>
				<div className='bold'>Login</div>
				<div className='divider'></div>
				<form action={actionFunc}>
					<label>Username
						{state?.errors.username && (<span className='text-red-500 bold'>: {state?.errors.username[0]}</span>)}
						<br/>
						<input type='text' name='username' defaultValue={state?.formData.username} placeholder='Enter your username'/> <br/>
					</label>

					<label>Password
						{state?.errors.password && (<span className='text-red-500 bold'>: {state?.errors.password[0]}</span>)}
						<br/>
						<input type='password' name='password' defaultValue={state?.formData.password} placeholder='Enter Your password'/> <br/>
					</label>

					<div className='divider'></div>
					<div className='button-container'>
						<button className={`submit-button ${isPending ? "button-disabled" : "button-abled"}`} type='submit' disabled={isPending}>
							{isPending ? "Submitting..." : "Submit"}
						</button>
					</div>
					<Link className='login-signup-toggle' href="/signup">Don't have an account? Sign up.</Link>
				</form>
			</div>
		</div>
	)
}
