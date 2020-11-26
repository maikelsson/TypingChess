import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../authentication/AuthState';

const EVENT_TYPES = {
	ADD_CONNECTION: "ADD_CONNECTION"
}

const SocketContext = createContext();

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({children}) {
	const [socket, setSocket] = useState();

	const { authenticatedUser } = useContext(AuthContext);

	useEffect(() => {
		const newSocket = io();
		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log("socket connected!");
			newSocket.emit('message', ({event: EVENT_TYPES.ADD_CONNECTION, data: authenticatedUser}));
		});

		newSocket.on('disconnect', (reason) => {
			if(reason === 'io server disconnect') {
				newSocket.connect();
			}
		})

		return () => newSocket.close();
	}, [authenticatedUser])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}
