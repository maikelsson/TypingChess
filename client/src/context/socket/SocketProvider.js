import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({children}) {
	const [socket, setSocket] = useState();

	useEffect(() => {
		const newSocket = io();
		setSocket(newSocket);

		return () => newSocket.close();
	}, [])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}
