import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import useMatchmaking from '../sockets/useMatchmaking';
import socketIOClient from 'socket.io-client';
import { GamePanel } from '../components/GamePanel';


export const GameView = () => {

	const { currentUser } = useContext(AuthContext);
	//const { connections, sendNewConnection } = useMatchmaking();

	const [connections, setConnections] = useState([]);
	const [opponentName, setOpponentName] = useState('')
	const [roomName, setRoomName] = useState('');
	
 
	useEffect(() => {
		//sendNewConnection(currentUser.username, false);
		//console.log(connections);
		const socket = socketIOClient();
		socket.emit('ADD_NEW_CONNECTION', currentUser.username);
		socket.on('GET_CONNECTIONS', (data) => {
			console.log("getdata", data);
			setConnections(data.gameRoomUsers);
			setRoomName(data.name);
			setOpponentName(data.opponent)
		});

		socket.emit('TRY_JOIN_AVAILABLE_ROOM', currentUser.username);

		// closes socket connection when this component unmounts
		return () => socket.disconnect(); 
	}, []);

	return (
		<div>
			<h1>GameView {roomName}</h1>
			<h4>Players currently looking for a match: {connections.length}</h4>
			<div>
			</div>
			<GamePanel myName={currentUser.username} opponent={opponentName}/>

		</div>
		
	)
}