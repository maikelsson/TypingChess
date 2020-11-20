import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/authentication/AuthState'


export const HomeView = () => {
	const { setAuthState, setUserLoggedIn, currentUser } = useContext(AuthContext);
	useEffect(() => {
		console.log(currentUser);
	}, [])

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
			<Link to="/game">
				<button>
					game
				</button>
			</Link>
		</div>
	)
}
