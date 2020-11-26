import React, { useState, useContext, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/authentication/AuthState';

export default function Register() {
	const nameRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const { register } = useContext(AuthContext)
	const history = useHistory();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('')
	const [registerStatus, setRegisterStatus] = useState('')

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError('');
			setIsLoading(true);
			await register(nameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
			setRegisterStatus("Registeration success!");
		} catch (err) {
			setError(err.message);
		}

		nameRef.current.value = "";
		passwordRef.current.value = "";
		confirmPasswordRef.current.value = "";
		setIsLoading(false);
	}

	return (
		<>
			{error && 
			<Alert variant="danger" dismissible="true">
				{error}
				<Button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></Button>
			</Alert>}
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Register</h2>
					<Form onSubmit={handleSubmit}>
						<Form.Group id="username">
							<Form.Label>Username</Form.Label>
							<Form.Control required type="text" ref={nameRef}></Form.Control>
						</Form.Group>
						<Form.Group required id="password">
							<Form.Label>Password</Form.Label>
							<Form.Control required type="password" ref={passwordRef}></Form.Control>
						</Form.Group>
						<Form.Group id="confirm-password">
							<Form.Label>Confirmation Password</Form.Label>
							<Form.Control required type="password" ref={confirmPasswordRef}></Form.Control>
						</Form.Group>
						<Button className="w-100" disabled={isLoading} type="submit">Sign Up</Button>
					</Form>
					{registerStatus ?? <p>{registerStatus}</p>}
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-2">
				Have an account already? <Link to="/login">Log In</Link>
			</div>
		</>
	)
}