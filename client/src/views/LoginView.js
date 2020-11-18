import React, { useContext } from 'react'
import Header from '../components/Header'
import { LoginForm } from '../components/LoginForm'
import { Paper, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { GlobalContext } from '../context/GlobalState'

const useStyles = makeStyles({
	root: {
		background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
	}
})

export const LoginView = ()  => {
	const classes = useStyles();
	const context = useContext(GlobalContext);

	console.log(context.users);

	return (
		<Paper className={classes.root} elevation={3} style={{
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
