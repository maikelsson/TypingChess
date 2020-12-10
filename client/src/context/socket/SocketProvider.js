import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../authentication/AuthState';
import { useHistory } from 'react-router-dom';
import * as EVENTS from '../../constants/events/server';
import { CLIENT_CONNECTION, CLIENT_ROOM } from '../../constants/events/client';

const SocketContext = createContext();

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({children}) {
	const [socket, setSocket] = useState();
	const history = useHistory();

	const { authenticatedUser } = useContext(AuthContext);

	useEffect(() => {
		const newSocket = io();
		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log("socket connected!");
			newSocket.emit('message', ({event: CLIENT_CONNECTION.UPDATE, data: authenticatedUser}));
		});

		newSocket.on('response', (data) => {
			console.log("socket got response!");
		})

		newSocket.on('disconnect', (reason) => {
			if(reason === 'io server disconnect') {
				newSocket.connect();
			}
			newSocket.emit('message', ({event: CLIENT_ROOM.LEAVE}))
			newSocket.emit('message', ({event: CLIENT_CONNECTION.REMOVE}))
			newSocket.close();
			history.push('/login');
		})

		return () => newSocket.close('connect');
	}, [authenticatedUser, history])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}
