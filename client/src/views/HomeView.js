import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/authentication/AuthState'
import {io} from 'socket.io-client';

export const HomeView = () => {
	const { setAuthState, setUserLoggedIn, currentUser } = useContext(AuthContext);

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
