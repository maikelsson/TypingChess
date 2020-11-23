import { useEffect, useRef, useState} from 'react';
import socketIOClient from 'socket.io-client';

const NEW_USER_CONNECTED_EVENT = "newUserConnection";

const useMatchmaking = () => {
	const [connections, setConnections] = useState([])
	const socketRef = useRef();

	useEffect(() => {
		console.log("connection");
		socketRef.current = socketIOClient();

		socketRef.current.on(NEW_USER_CONNECTED_EVENT, (user) => {
			const userConnection = {
				...user,
				isOwnConnection: user.senderId === socketRef.current.id ? true : false,
			};
			setConnections((connections) => [...connections, userConnection]);
		})

		return () => {
			socketRef.current.disconnect();
			console.log("disconnect");
		};
	}, []);

	const sendNewConnection = (connectionBody) => {
		socketRef.current.emit(NEW_USER_CONNECTED_EVENT, {
			body: connectionBody,
			senderId: socketRef.current.id,
		});
	};

	return {connections, sendNewConnection};
}

export default useMatchmaking;