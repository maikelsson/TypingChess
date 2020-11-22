import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import useMatchmaking from '../sockets/useMatchmaking';
import socketIOClient from 'socket.io-client';
import { GamePanel } from '../components/GamePanel';


export const GameView = () => {

	const { currentUser } = useContext(AuthContext);
	//const { connections, sendNewConnection } = useMatchmaking();

	const [connections, setConnections] = useState([])
 
	useEffect(() => {
		//sendNewConnection(currentUser.username, false);
		//console.log(connections);
		const socket = socketIOClient();
		socket.emit('ADD_NEW_CONNECTION', currentUser.username);
		socket.on('GET_CONNECTIONS', conns => {
			console.log("getconns", conns);
			let newArr = conns;
			console.log(newArr, "newArr");
			setConnections({connections: conns});
			console.log(connections, "connections");
		});


		// closes socket connection when this component unmounts
		return () => socket.disconnect(); 
	}, []);

	return (
		<div>
			<h1>GameView</h1>
			<h4>Players currently looking for a match: {connections.length}</h4>
			<div>
			</div>
			<GamePanel />

		</div>
		
	)
}