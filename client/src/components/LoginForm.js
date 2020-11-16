import React, {useContext, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {TextField, Box, Button} from '@material-ui/core'
import { GlobalContext } from '../context/GlobalState';

export const LoginForm = () => {
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const { users, getUsers } = useContext(GlobalContext);

	useEffect(() => {
		getUsers();
		console.log("got the users");
	}, [])

	let history = useHistory();

	const onSubmit = (e) => {
		e.preventDefault();
		const found = users.some(u => u.username === name && u.password === password);
		if(found) {
			console.log(users)
			console.log("user found!");
			history.push("/home")
		} else {
			console.log("User not found")
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<Box flexDirection="row" style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			}}>
				<Box padding="0.5em">
					<TextField value={name} onChange={(e) => setName(e.target.value)} label="Name"/>
				</Box>
				<Box padding="0.5em">
					<TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} label="Password"/>
				</Box>
				<Box>
					<Button type="submit" variant="contained" color="primary" onClick={() => console.log("click")}>Login</Button>
				</Box>
			</Box>
		</form>
	)
}
