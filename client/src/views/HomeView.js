import React, { useContext } from 'react'
import { AuthContext } from '../context/authentication/AuthState'

export const HomeView = () => {
	const { setAuthState, setUserLoggedIn, currentUser } = useContext(AuthContext)

	const onLogOut = (e) => {
		e.preventDefault();
		setAuthState(false);
		setUserLoggedIn(null);
	}

	return (
		<div>
			At home!
			<button onClick={(e) => onLogOut(e)}>LogOut</button>
			<p>Currently logged in as a: {currentUser.username}</p>
		</div>
	)
}
