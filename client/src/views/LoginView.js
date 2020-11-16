import React, { useContext } from 'react'
import Header from '../components/Header'
import { LoginForm } from '../components/LoginForm'
import { Paper, Button } from '@material-ui/core'
import { GlobalContext } from '../context/GlobalState'

export const LoginView = ()  => {

	const context = useContext(GlobalContext);

	console.log(context.users);

	return (
		<Paper elevation={3} style={{
			padding: "3em",
			display: "flex",
			alignItems: "center",
			flexDirection: "column"
		}}>
			<Header title={"Login"} />
			<LoginForm />
			Don't have account yet? <span><Button variant="contained" color="secondary" href="/register">Register</Button></span>
		</Paper>
	)
}
