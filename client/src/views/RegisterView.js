import React from 'react'
import { Paper, Button, Box } from '@material-ui/core';
import Header from '../components/Header'
import { RegisterForm } from '../components/RegisterForm';
import { ErrorMessage } from '../components/ErrorMessage';

export const RegisterView = () => {

	return (
		<Paper style={{
			padding: "3em",
		}}>
			<Box flexDirection='row'>
				<Header title="Register"/>
				<ErrorMessage />
				<RegisterForm />
				<Box>
					Already registered? <span><Button href="/login">Login</Button></span>
				</Box>
			</Box>
		</Paper>
	)
}
