import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';
import { ROOM_EVENT_TYPES, GAME_EVENT_TYPES } from '../constants/events';
import { useHistory } from 'react-router-dom';

import * as EVENTS from '../constants/events';

import Chessground from 'react-chessground';
import "react-chessground/dist/styles/chessground.css";
import './styles/lobby.scss';
import MainContainer from './containers/MainContainer';

const dummyRooms = [
	{
		name: 'player1_room',
		players: [
			'player1'
		],
		time: '10+0',
		type: 'rapid'
	},
	{
		name: 'matti878_room',
		players: [
			'matti878', "ratti"
		],
		time: '3+2',
		type: 'blitz'
	}
]

export default function Lobby() {

	const { authenticatedUser } = useContext(AuthContext);
	const socket = useSocket();
	const history = useHistory();
	const [boardState, setBoardState] = useState('start');
	const [error, setError] = useState('');
	const [activeTab, setActiveTab] = useState('newgame');

	//useEffect(() => {
	//	if(socket === null) return;
	//	
	//	socket.on('response', (data) => {
	//		if(!data) return;
	//		console.log("got response");
	//		switch(data.res) {
	//			case "SERVER_MOVE_SUCCESS":
	//				console.log(data.data);
	//				setBoardState(data.data);
	//				return;
	//			case "SERVER_MOVE_ERROR":
	//				setError(data.data);
	//				return;
	//			default:
	//				return;
	//		}
	//	});
//
	//	return () => socket.off();
//
	//}, [socket]);

	function getRooms() {
		console.log("getting rooms");
		//socket.emit('request', ({event: EVENTS.REQUEST_EVENT_TYPES.PLAYER_REQUEST_ROOMS}))
	}

	function handleLeave(e) {
		e.preventDefault();
		socket.emit('message', ({event: ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}))
		history.push('/');
	}

	function handleTabClick(e) {
		e.preventDefault();
		setActiveTab(e.target.name);
	}

	return (
			<>
				<MainContainer>
					<div className="board-container">
						<div className="status-panel">
							<p>asd</p>
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
							<button className="create-new-btn">Create new</button>
						</div>

						<div name="rooms" className={activeTab === 'rooms' ? 'tab-content-active' : 'tab-content-disabled'}>
							{activeTab === 'rooms' ? getRooms() : null}
							<h2>Rooms</h2>
							<div className="room-list">
								{dummyRooms ? 
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
										{dummyRooms.map((r) => (
											<>
												{r.players.length < 2 
												?	<li>
														<p>{r.name}</p>
														<p>{r.time}</p>
														<p>{r.type}</p>
														<button>Join</button>					
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

