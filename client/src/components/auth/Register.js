import React, { useState, useContext, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authentication/AuthState';
import AuthContainer from '../containers/AuthContainer';

import './auth.scss'

export default function Register() {
	const nameRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const { register } = useContext(AuthContext)
	const history = useHistory();

	const [error, setError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError('');
			await register(nameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
			setError('Register successfull, please go to login page!');
		} catch (err) {
			setError(err.message);
		}

		e.target.reset();
	}

	return (
		<>
		<AuthContainer>			
			<div className="auth-card">
				{error ?? <p></p>}
				<form onSubmit={handleSubmit}>
					<h2>Register</h2>
					<label>Username</label>
					<input required type="text" ref={nameRef} autoComplete="true"></input>
					<label>Password</label>
					<input required type="password" ref={passwordRef} autoComplete="true"></input>
					<label>Confirm Password</label>
					<input required type="password" ref={confirmPasswordRef} autoComplete="true"></input>
					<div className="spacer"/>
					<button type="submit">Register</button>
				</form>
				<div className="spacer" />
				<p>
					Already have an account? <span><Link to="/login" style={{
						color: 'white',
						textDecoration: 'none'
					}}><strong>Login</strong></Link></span>
				</p>
			</div>
		</AuthContainer>

		</>
	)
}