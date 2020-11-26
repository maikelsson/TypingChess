import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';


export default function Game() {

	const { authenticatedUser } = useContext(AuthContext);
	const socket = useSocket();

	useEffect(() => {
		if(socket === null) return;
		console.log(socket.id);
	}, [socket])

	return (
		<div>
			GameView! 
		</div>
	)
}
