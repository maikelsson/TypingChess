import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/authentication/AuthState'


export const HomeView = () => {
	const { setAuthState, setUserLoggedIn, currentUser } = useContext(AuthContext);
	
	const [currentUsers, setCurrentUsers] = useState([]);

	useEffect(() => {
		console.log(currentUser);
	}, [])

	const onLogOut = (e) => {
		e.preventDefault();
		setAuthState(false);
		setUserLoggedIn(null);
	}

	const getCurrentUsers = (e) => {
		e.preventDefault();
		console.log("hello");
	}

	return (
		<>
				At home!
				<button onClick={(e) => onLogOut(e)}>LogOut</button>
				<p>Currently logged in as a: {currentUser.username}</p>
				<Link to="/game">
					<button>
						find game
					</button>
				</Link>
				<button onClick={(e) => getCurrentUsers(e)}>Refresh</button>
				{currentUsers.map((u) => (
					u
				))}
		</>
	)
}
