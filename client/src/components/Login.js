import React, { useState, useContext, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/authentication/AuthState';

export default function Login() {
	const passwordRef = useRef();
	const nameRef = useRef();
	const { login } = useContext(AuthContext)
	const history = useHistory();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError('');
			setIsLoading(true);
			await login(nameRef.current.value, passwordRef.current.value);
			history.push("/");
		} catch (err) {
			setError(err.message)
		}

		setIsLoading(false);
	}

	return (
		<>
			<div className="d-flex align-items-center justify-content-center" style={{
				minHeight: '50vh',
				
			}}>
				{error && <Alert variant="danger" dismissible="true">{error}</Alert>}
				<Card style={{
					minWidth: '20em',
					maxWidth: '500px',
					width: '100vh'
				}}>
					<Card.Body>
						<h2 className="text-center mb-4">Log In</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group id="username">
								<Form.Label>Username</Form.Label>
								<Form.Control required type="text" ref={nameRef}></Form.Control>
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password</Form.Label>
								<Form.Control required type="password" ref={passwordRef}></Form.Control>
							</Form.Group>
							<Button className="w-100" disabled={isLoading} type="submit">Log In</Button>
						</Form>
					</Card.Body>
					<Card.Footer>
						<p className="w-100 text-center mt-2">No account yet? <Link to='/register'>Register now</Link></p>
					</Card.Footer>
				</Card>
			</div>
			
		</>
	)
}
