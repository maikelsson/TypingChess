import React, {useContext, useEffect} from 'react';
import { AuthContext } from '../context/authentication/AuthState'

export const GameView = () => {

	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		if(currentUser === null) return;
		console.log("GameView");
	})

	return (
		<h1>GameView</h1>
	)
}