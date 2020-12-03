import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authentication/AuthState';
import * as EVENTS from '../constants/events';

import {useSocket} from '../context/socket/SocketProvider';

import './styles/home.scss';

export default function CustomNavbar() {

	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const [rooms, setRooms] = useState([]);

	const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	const socket = useSocket();
	const history = useHistory();
	const { logout } = useContext(AuthContext);


	//useEffect(() => {
	//	if(!socket) return;
	//	
	//	socket.on('response', (data) => {
	//		if(!data) return;
	//		switch(data.res) {
	//			case EVENTS.RESPONSE_EVENT_TYPES.PLAYER_REQUEST_ROOMS_SUCCESS:
	//				console.log(data.res, data.data);
	//				setRooms(data.data);
	//				break;
	//			case EVENTS.RESPONSE_EVENT_TYPES.PLAYER_REQUEST_JOIN_ROOM_SUCCESS:
	//				console.log("joining!");
	//				break;
	//			default:
	//				break;
	//		}
	//		setLoading(false);
	//	})
//
	//	return () => socket.off('response')
	//}, [socket, history])

	async function handleLogout(e) {
		e.preventDefault();
		await logout();
	}

	function handleRefresh(e) {
		e.preventDefault();
		// get rooms from server
		socket.emit('request', ({event: EVENTS.REQUEST_EVENT_TYPES.PLAYER_REQUEST_ROOMS}))
		setLoading(true);

	}

	function handleJoinRoom(e, roomId) {
		e.preventDefault();
		console.log("joining room", roomId);
		socket.emit('request', ({event: EVENTS.ROOM_EVENT_TYPES.PLAYER_JOIN_ROOM, data: roomId}));
		history.push("/game");
	}

	function onEnteringRoomsModal() {
		setLoading(true);
		// get rooms from server

		setLoading(false);
	}

	function handleCreateGame() {
		socket.emit('message', ({event: EVENTS.ROOM_EVENT_TYPES.PLAYER_CREATE_ROOM}));
		history.push("/game");
	}

	return (
		<div className="sidenav">
			<ul>
				<li><h2>TypeChess</h2></li>
				<li><Link to="/home">Home</Link></li>
				<li><Link to="/lobby">Play</Link></li>
				<li><Link to="/play">Game</Link></li>
			</ul>
		</div>
	)
}
