import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../authentication/AuthState';
import { useHistory } from 'react-router-dom';
import * as EVENTS from '../../constants/events/server';

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
			newSocket.emit('message', ({event: EVENTS.CONNECTION_EVENT_TYPES.ADD_CONNECTION, data: authenticatedUser}));
		});

		newSocket.on('response', (data) => {
			console.log("socket got response!");
		})

		newSocket.on('disconnect', (reason) => {
			if(reason === 'io server disconnect') {
				newSocket.connect();
			}
			newSocket.emit('message', ({event: EVENTS.ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}))
			newSocket.close();
			history.push('/login');
		})

		return () => newSocket.close();
	}, [authenticatedUser, history])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}
