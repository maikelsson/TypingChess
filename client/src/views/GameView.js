import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import { GamePanel } from '../components/GamePanel';
import { useSocket } from '../context/socket/SocketProvider';

export const GameView = () => {

	const { currentUser } = useContext(AuthContext);

	const [opponentName, setOpponentName] = useState('')
	const [roomName, setRoomName] = useState('');
	const socket = useSocket();

	useEffect(() => {
		if(socket === null) return;

		socket.emit('GET_ROOM_DETAILS');
		socket.on('GET_ROOM_DETAILS', ({roomName, users}) => {
			if(users.gameRoomUsers.length === 2){
				let opponent = users.gameRoomUsers.find((u) => u !== currentUser.username);
				setOpponentName(opponent);
			}
			console.log("getting", users)
			setRoomName(roomName);

		})

		// unsubscribe from events
		return () => socket.off('GET_ROOM_DETAILS'); 
	}, [socket, currentUser]);

	return (
		<div>
			<h1>ROOM: {roomName}</h1>
			<div>
			</div>
			<GamePanel myName={currentUser.username} opponent={opponentName}/>

		</div>
		
	)
}