import React, { useEffect, useState } from 'react';
import {useSocket} from '../context/socket/SocketProvider';
import { ROOM_EVENT_TYPES } from '../constants/events/server';
import { useHistory } from 'react-router-dom';

import * as EVENTS from '../constants/events/server';
import { CLIENT_CONNECTION, CLIENT_ROOM, CLIENT_REQUEST } from '../constants/events/client';
import { SERVER_ROOM_SUCCESS, SERVER_ROOM_ERROR, SERVER_REQUEST_SUCCESS, SERVER_REQUEST_ERROR } from '../constants/events/server';



import Chessground from 'react-chessground';
import "react-chessground/dist/styles/chessground.css";
import './styles/lobby.scss';
import MainContainer from './containers/MainContainer';
import RoomList from './RoomList';


export default function Lobby() {

	const socket = useSocket();
	const history = useHistory();
	const [error, setError] = useState('');
	const [activeTab, setActiveTab] = useState('newgame');
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		if(socket === null) return;
		
		socket.emit('request', ({event: CLIENT_REQUEST.ROOMS}))
		
		socket.on('response', (data) => {
			if(!data) return;
			switch(data.res) {

				case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOMS:
					setRooms(data.data);
					break;

				case SERVER_REQUEST_ERROR.CLIENT_REQUEST_ROOMS:
					console.log("some error from requesting rooms");
					break;

				case SERVER_ROOM_SUCCESS.CLIENT_CREATE_ROOM:
					console.log("created room succesfully and joining it!");
					history.push("/play");
					break;
				
				case SERVER_ROOM_ERROR.CLIENT_CREATE_ROOM:
					console.log("error when creating a room!");
					break;

				default:
					break;
			}
		});

		return () => socket.off('response');

	}, [socket, history]);

	function requestRoomsFromServer() {
		console.log("getting rooms");
		setTimeout(() => {
			socket.emit('request', ({event: CLIENT_REQUEST.ROOMS}))
		}, 2000);
	}

	function handleJoinRoom(e, id) {
		e.preventDefault();
		socket.emit('message', ({event: CLIENT_ROOM.JOIN, roomId: id}))
		history.push("/play");
	}

	function handleTabClick(e) {
		e.preventDefault();
		setActiveTab(e.target.name);
	}

	function handleCreateRoom(e, type, seconds, increment) {
		e.preventDefault();
		
		let timeModel = {
			type: type,
			seconds: seconds,
			increment: increment
		};

		socket.emit('message', ({event: CLIENT_ROOM.CREATE, payload: timeModel}));
	} 

	return (
			<>
				<MainContainer>
					<div className="board-container">
						<div className="status-panel">
							<div className="top-row">
								<div className="logo">
									TC
								</div>
								<div className="room-info">
									15+15 • Casual • Classic <br/>
          				Game Running
								</div>
							</div>
							<div className="bottom-row">
								<div className="player-white">
									<div className="white-circle">

									</div>
									Player white (1400)
								</div>
								<div className="player-black">
									<div className="black-circle">

									</div>
									Player black (1230)
								</div>
							</div>
						</div>
						<Chessground resizeble={true} viewOnly={true} orientation="white"/>
						
					</div>
					<div className="side-panel">
						<div className="tab">
							<button name="newgame" className={activeTab === 'newgame' ? 'active' : ''} onClick={handleTabClick}>New Game</button>
							<button name="rooms" className={activeTab === 'rooms' ? 'active' : ''} onClick={handleTabClick}>Rooms</button>
							<button name="players" className={activeTab === 'players' ? 'active' : ''} onClick={handleTabClick}>Players</button>
						</div>

						<div name="newgame" className={activeTab === 'newgame' ? 'tab-content-active' : 'tab-content-disabled'}>
							<h2>Play Chess</h2>
							<div className="button-container">
								<button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Blitz', 180, 2)}>Blitz <span>(3 + 2)</span></button>
								<button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Rapid', 600, 0)}>Rapid <span>(10 + 0)</span></button>
								<button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Classic', 900, 15)}>Classic<span>(15+15)</span></button>
							</div>
						</div>

						<div name="rooms" className={activeTab === 'rooms' ? 'tab-content-active' : 'tab-content-disabled'}>
							{activeTab === 'rooms' ? requestRoomsFromServer() : null}
							<h2>Rooms</h2>
							<RoomList rooms={rooms} handleJoin={handleJoinRoom}></RoomList>
						</div>
						<div name="players" className={activeTab === 'players' ? 'tab-content-active' : 'tab-content-disabled'}>
							<h2>Players</h2>
						</div>
					</div>
				</MainContainer>
	
		</>
	)
}

