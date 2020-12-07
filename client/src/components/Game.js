import React, {useState, useRef, useEffect} from 'react';
import Chessground from 'react-chessground';
import { useSocket } from '../context/socket/SocketProvider';
import MainContainer from './containers/MainContainer';
import * as SERVER_EVENT from '../constants/events/server';

import './styles/game.scss';
import { ROOM_EVENT_TYPES } from '../constants/events/server';

export default function Game() {

	const socket = useSocket();
	const [boardState, setBoardState] = useState('');
	const [moves, setMoves] = useState([]);
	const moveRef = useRef();
	const [myPlayer, setMyPlayer] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const [gameState, setGameState] = useState('');
	const [turnColor, setTurnColor] = useState('white');

	//const [myTime, setMyTime] = useState(900);
	//const [opponentTime, setOpponentTime] = useState(900);

	//useEffect(() => {
	//	if(gameState !== 'GAME_RUNNING') return;
	//	if(!myPlayer.side === turnColor)
	//	const interval = setInterval(() => getRoomDetails(), 1000);
	//	return () => {
	//		clearInterval(interval);
	//	}
	//}, [])

	useEffect(() => {
		if(socket === null) return;
		socket.emit('request', ({event: SERVER_EVENT.ROOM_EVENT_TYPES.PLAYER_JOINED_ROOM_SUCCESS}));
		socket.on('response', (data) => {
			if(!data) return;
			switch(data.res) {
				case "SERVER_MOVE_SUCCESS":
					console.log(data);
					setBoardState(data.fen);
					setMoves(data.history);
					setGameState(data.currentState);
					setTurnColor(data.color);
					break;
				case "SERVER_MOVE_ERROR":
					console.log("not valid move!");
					break;
					
				case 'JOIN_ROOM_SUCCESS':
					setGameState(data.currentState);
					if(data.white.id === socket.id) {
						setMyPlayer(data.white);
						setOpponent(data.black);
					} else {
						setMyPlayer(data.black);
						setOpponent(data.white);
					}
					break;

				case 'PLAYER_LEFT_ROOM':
					setGameState(data.currentState);
					setOpponent(null);
					break;

				default: 
					break; 
			}

			return () => {
				socket.emit('message', ({event: SERVER_EVENT.ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}))
				socket.off('response')
			};

		}, [socket])

		return () => {
			socket.emit('message', ({event: SERVER_EVENT.ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}));
			socket.off('response');
		}
	}, [socket])

	function handleInput(e) {
		e.preventDefault();
		if(gameState === "GAME_RUNNING") {
			socket.emit('game', ({event: SERVER_EVENT.GAME_EVENT_TYPES.PLAYER_MAKE_MOVE, move: moveRef.current.value}));
		}
		e.target.reset();
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
					<Chessground orientation={myPlayer ? myPlayer.side : 'white'} viewOnly={true} fen={boardState}/>
					<div style={{
						marginTop: "30px",
						display: "flex",
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<p>Type your move: </p>
						<form className="move-input" onSubmit={handleInput}>
							<input className="move-input" type="text" ref={moveRef}/>
							<input type="submit" hidden={true} onSubmit={handleInput}/>
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
							{opponent ? 
							<div className={turnColor === opponent.side ? 'time-active' : 'time'}>
								<p>15:00</p>
							</div> : 
							<div className="time">
								<p>10:00</p>
							</div> }
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
						<div className="player-panel">
							<i className={myPlayer ? 'indicator-online' : 'indicator-offline'}></i>
							<p>{myPlayer ? myPlayer.name : ''}</p>
						</div>
						<div className="time-panel">
							{myPlayer ? 
							<div className={turnColor === myPlayer.side ? 'time-active' : 'time'}>
								<p>15:00</p>
							</div> : 
							<div className="time">
								<p>10:00</p>
							</div> }
						</div>
					</div>
		</MainContainer>
		
	)
}
