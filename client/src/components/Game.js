import React, {useState, useRef, useEffect} from 'react';
import Chessground from 'react-chessground';
import { useSocket } from '../context/socket/SocketProvider';
import MainContainer from './containers/MainContainer';
import * as SERVER_EVENT from '../constants/events/server';
import * as CLIENT_EVENT from '../constants/events/client';

import './styles/game.scss';

export default function Game() {

	const socket = useSocket();
	const [boardState, setBoardState] = useState('');
	const [moves, setMoves] = useState([]);
	const moveRef = useRef();
	const [myPlayer, setMyPlayer] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const [gameState, setGameState] = useState('');

	//useEffect(() => {
	//	//if(myPlayer && opponent) return;
	//	const interval = setInterval(() => getRoomDetails(), 2000);
	//	return () => {
	//		clearInterval(interval);
	//	}
	//}, [])

	useEffect(() => {
		if(socket === null) return;
		//socket.emit('message', ({data: player, event: EVENTS.ROOM_EVENT_TYPES.PLAYER_JOINED_ROOM_SUCCESS}));
		socket.on('response', (data) => {
			if(!data) return;
			switch(data.res) {
				case "SERVER_MOVE_SUCCESS":
					console.log(data.data);
					setBoardState(data.data);
					setMoves(data.history);
					break;
				case "SERVER_MOVE_ERROR":
					console.log("not valid move!");
					break;

				case "RECEIVE_DETAILS_SUCCESS":
					if(data.data.player_white.id === socket.id) {
						setMyPlayer(data.data.player_white);
						setOpponent(data.data.player_black);
					} else {
						setMyPlayer(data.data.player_black);
						setOpponent(data.data.player_white);
					}

					setGameState(data.data.gameState);

					break;

				default: 
					return; 
			}

			return () => socket.off('response');

		}, [socket])

		return () => {
			socket.emit('message', ({event: SERVER_EVENT.ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}));
			socket.off('response');
		}
	}, [socket])

	function handleInput(e) {
		e.preventDefault();
		socket.emit('game', ({event: SERVER_EVENT.GAME_EVENT_TYPES.PLAYER_MAKE_MOVE, move: moveRef.current.value.toLowerCase()}));
		e.target.reset();
	}

	function getRoomDetails() {
		console.log("getting details!");
		socket.emit('game', ({event: SERVER_EVENT.GAME_EVENT_TYPES.PLAYER_REQUEST_ROOM_DETAILS}));
	}

	return (
		<MainContainer>
			<div className="board-container">
					<div className="status-panel">
						<h3>Game {gameState ? gameState : 'Waiting for opponent...'}</h3>
						<p>{myPlayer ? myPlayer.name : ''}</p>
						<p>vs</p>
						<p>{opponent ? opponent.name : 'Opponent'}</p>
					</div>
					<Chessground orientation={myPlayer ? myPlayer.side : 'white'} viewOnly="true" fen={boardState}/>
					<div style={{
						marginTop: "30px",
						display: "flex",
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<p>Type your move: </p>
						<form className="move-input" onSubmit={handleInput}>
							<input className="move-input" type="text" ref={moveRef}/>
							<input type="submit" hidden="true" onSubmit={handleInput}/>
						</form>
					</div>
				</div>
				<div className="side-panel" style={{
					backgroundColor: "#24292E",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignContent: "center",
					alignItems: "center"

				}}>
						<div className="time-panel">
							<div className="time">
								<p>15:00</p>
							</div>
						</div>
						<div className="player-panel">
							<i className={opponent ? 'indicator-online' : 'indicator-offline'}></i>
							<p>{opponent ? opponent.name : 'Opponent'}</p>
						</div>
						<div className="history-panel">
							<h4>History:</h4>
							<ol>
								{moves.map((m, i) => 
								(
									<>
										{i % 2 === 0 ? <li className="index">{i === 0 ? i + 1 : i / 2 + 1}.</li> : null}
										<li key={i}>{m}</li>
									</>
								))}
							</ol>
						</div>
						<div className="bottom-button-container">
							<button>S</button>
						</div>
						<div className="player-panel">
							<i className={myPlayer ? 'indicator-online' : 'indicator-offline'}></i>
							<p>{myPlayer ? myPlayer.name : ''}</p>
						</div>
						<div className="time-panel">
							<div className="time">
								<p>15:00</p>
							</div>
						</div>
					</div>
		</MainContainer>
		
	)
}
