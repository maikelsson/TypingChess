import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authentication/AuthState';
import * as EVENTS from '../constants/events/server';

import './styles/main.scss';

export default function CustomNavbar() {

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

	return (
		<div className="sidenav">
			<ul>
				<li><h2>TypeChess</h2></li>
				<li><Link to="/home">Home</Link></li>
				<li><Link to="/lobby">Play</Link></li>
				<li><Link to="/play">Game</Link></li>
				<li><button onClick={handleLogout}>LogOut</button></li>
			</ul>
		</div>
	)
}
