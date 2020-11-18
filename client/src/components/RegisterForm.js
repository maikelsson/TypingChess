import React, { useContext, useState } from 'react';
import { TextField, Box, Button } from '@material-ui/core';
import { GlobalContext } from '../context/GlobalState';

export const RegisterForm = () => {

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const { addRegisteredUser } = useContext(GlobalContext);

	const onSubmit = (e) => {
		e.preventDefault();
		if(password.length < 3 || confirmPassword.length < 3) {
			if(password !== confirmPassword) {
				return;
			}
		} 
		else {
			const newUser = {
				username: name,
				password
			}
	
			addRegisteredUser(newUser);
			resetInputFields();
			console.log("Registered new user!")
		}
		
	}

	const resetInputFields = () => {
		setName('');
		setPassword('');
		setConfirmPassword('');
	}

	return (
		<form onSubmit={onSubmit} style={{
			
		}}>
			<Box flexDirection="row" style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			}}>
				<Box padding="0.5em">
					<TextField value={name} onChange={(e) => setName(e.target.value)} label="Name"/>
				</Box>
				<Box padding="0.5em">
					<TextField error={true} type="password" value={password} onChange={(e) => setPassword(e.target.value)} label="Password"/>
				</Box>
				<Box padding="0.5em">
					<TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Retype Password"/>
				</Box>
				<Box padding="0.5em" style={{
					alignContent: 'center'
				}}>
					<Button type="submit" variant="contained" color="primary">Register</Button>
					
				</Box>

			</Box>
		</form>
	)
}