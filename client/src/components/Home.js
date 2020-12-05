import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';
import MainContainer from './containers/MainContainer';

export default function Home() {
	const { authenticatedUser } = useContext(AuthContext);
	const socket = useSocket();

	useEffect(() => {
		if(!socket) return;
		console.log(socket.id);
		console.log(authenticatedUser);

		return () => socket.off();

	}, [socket, authenticatedUser])

	return(
		<>
		<MainContainer>

		</MainContainer>
			<p>asdasdasd</p>
		</>
	)
}