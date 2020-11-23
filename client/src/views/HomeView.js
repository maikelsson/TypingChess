import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';

export const HomeView = () => {
	const { setAuthState, setUserLoggedIn, currentUser } = useContext(AuthContext);
	
	const [currentUsers, setCurrentUsers] = useState([]);
	const [currentRooms, setCurrentRooms] = useState([]);

	const socket = useSocket();
	useEffect(() => {
		if(socket === null) return;

		socket.emit('ADD_NEW_CONNECTION', currentUser.username);
		socket.on('GET_CONNECTIONS', data => {
			setCurrentUsers(data.gameRoomUsers);
		})

		socket.on('GET_ROOMS', data => {
			setCurrentRooms(data);
		});

		return () => socket.off('GET_ROOMS', 'GET_CONNECTIONS', 'ADD_NEW_CONNECTION');
	}, [socket, currentUser]);

	const addRoomsToList = useCallback((data) => {
		socket.emit('GET_ROOMS');
	}, [socket])

	const userJoinRoom = useCallback((e, data) => {
		e.preventDefault();
		socket.emit('client_join_room', data);
	}, [socket])

	const onLogOut = (e) => {
		e.preventDefault();
		setAuthState(false);
		setUserLoggedIn(null);
	}

	const getCurrentRooms = (e) => {
		e.preventDefault();
		addRoomsToList();
	}

	return (
		<>	
			At home!
				<button onClick={(e) => onLogOut(e)}>LogOut</button>
				<p>Currently logged in as a: {currentUser.username}</p>
				<Link to="/game">
					<button>
						join current room
					</button>
				</Link>
				<button onClick={(e) => getCurrentRooms(e)}>Refresh</button>
				{currentRooms.map((r, id) => (
					<div key={id}>
						<p>
							{r.name} {r.gameRoomUsers.length} / 2 
							<span>
								<button to="/game" onClick={(e) => userJoinRoom(e, r.name)}>join</button>
							</span>
						</p>
					</div>
				))}
		</>
	)
}
