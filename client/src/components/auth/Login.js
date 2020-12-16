import React, { useState, useContext, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authentication/AuthState';

import './auth.scss'
import AuthContainer from '../containers/AuthContainer';

export default function Login() {
	const passwordRef = useRef();
	const nameRef = useRef();
	const { login } = useContext(AuthContext)
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('')

  React.useEffect(() => {
    return () => {
      return;
    }
  })

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError('');
			setLoading(true);
			await login(nameRef.current.value, passwordRef.current.value);
			history.push("/");
		} catch (err) {
			setError(err.message)
		}

		setLoading(false);
		e.target.reset();
	}

	return (
		<>
			<AuthContainer>
				<div className="auth-card">
					{error ?? <p></p>}
					<form onSubmit={handleSubmit}>
						<h2>Login</h2>
						<label>Username</label>
						<input required type="text" ref={nameRef} autoComplete="true"></input>
						<label>Password</label>
						<input required type="password" ref={passwordRef} autoComplete="true"></input>
						<div className="spacer"/>
						<button disabled={loading} type="submit">Login</button>
					</form>
					<div className="spacer" />
					<p>
						Don't have account yet? <span><Link to="/register" style={{
							color: 'white',
							textDecoration: 'none'
						}}><strong>Register</strong></Link></span>
					</p>
				</div>
			</AuthContainer>

		</>
	)
}
