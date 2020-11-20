import React, {useContext, useEffect} from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import useMatchmaking from '../sockets/useMatchmaking';

export const GameView = () => {

	const { currentUser } = useContext(AuthContext);
	const { connections, sendNewConnection } = useMatchmaking();

	useEffect(() => {
		sendNewConnection(currentUser.username, false);
	}, []);

	return (
		<div>
			<h1>GameView</h1>
			<div>
				connections:
				{connections.map((u) => (
					u.body
				))}
			</div>
		</div>
		
	)
}