import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';
import { ROOM_EVENT_TYPES } from '../constants/events/server';
import { useHistory } from 'react-router-dom';

import * as EVENTS from '../constants/events/server';

import Chessground from 'react-chessground';
import "react-chessground/dist/styles/chessground.css";
import './styles/lobby.scss';
import MainContainer from './containers/MainContainer';


export default function Lobby() {

	const { authenticatedUser } = useContext(AuthContext);
	const socket = useSocket();
	const history = useHistory();
	const [error, setError] = useState('');
	const [activeTab, setActiveTab] = useState('newgame');
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		if(socket === null) return;
		
		socket.on('response', (data) => {
			if(!data) return;
			console.log("got response");
			switch(data.res) {
				case EVENTS.RESPONSE_EVENT_TYPES.PLAYER_REQUEST_ROOMS_SUCCESS:
					console.log(data.data);
					setRooms(data.data);
					break;
				default:
					break;
			}
		});

		return () => socket.off('response');

	}, [socket]);

	function requestRoomsFromServer() {
		console.log("getting rooms");
		setTimeout(() => {
			socket.emit('request', ({event: EVENTS.REQUEST_EVENT_TYPES.PLAYER_REQUEST_ROOMS}))
		}, 3000);
	}

	function handleJoinRoom(e, id) {
		e.preventDefault();
		socket.emit('request', ({event: ROOM_EVENT_TYPES.PLAYER_JOIN_ROOM, data: id}))
		history.push("/play");
	}

	function handleTabClick(e) {
		e.preventDefault();
		setActiveTab(e.target.name);
	}

	function handleCreateRoom(e) {
		e.preventDefault();
		socket.emit('message', ({event: EVENTS.ROOM_EVENT_TYPES.PLAYER_CREATE_ROOM}));
		history.push("/play");
	} 

	return (
			<>
				<MainContainer>
					<div className="board-container">
						<div className="status-panel">
							<p>Lobby</p>
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
							<h2>New game</h2>
							<button className="create-new-btn" onClick={handleCreateRoom}>Create new</button>
						</div>

						<div name="rooms" className={activeTab === 'rooms' ? 'tab-content-active' : 'tab-content-disabled'}>
							{activeTab === 'rooms' ? requestRoomsFromServer() : null}
							<h2>Rooms</h2>
							<div className="room-list">
								{rooms ? 
								<>
									<ul className="header">
										<li>
											<p>name</p>
											<p>time</p>
											<p>type</p>
											<p>action</p>
										</li>
									</ul>
									<ul style={{
									height: '380px',
									overflow: "hidden",
									overflowY: "scroll"}}>
										{rooms.map((r) => (
											<>
												{r 
												?	<li key={r.id}>
														<p>{r.name}</p>
														<p>{r.time}</p>
														<p>{r.type}</p>
														<button onClick={(e) => handleJoinRoom(e, r.id)}>Join</button>					
													</li> 
												: null}
											</>))}
										</ul>
									</> 
									: <p>Loading...</p>}
							</div>
							
						</div>
						<div name="players" className={activeTab === 'players' ? 'tab-content-active' : 'tab-content-disabled'}>
							<h2>Players</h2>
						</div>
					</div>
				</MainContainer>
	
		</>
	)
}

