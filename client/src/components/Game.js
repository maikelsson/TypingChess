import React, {useState, useRef, useEffect, useCallback} from 'react';
import Chessground from 'react-chessground';
import { useSocket } from '../context/socket/SocketProvider';
import MainContainer from './containers/MainContainer';
import {SERVER_REQUEST_ERROR, SERVER_REQUEST_SUCCESS, SERVER_ROOM_ERROR, SERVER_ROOM_SUCCESS} from '../constants/events/server';
import {CLIENT_GAME, CLIENT_REQUEST, CLIENT_ROOM} from '../constants/events/client';

import './styles/game.scss';

export default function Game() {

	const socket = useSocket();
	const [boardState, setBoardState] = useState('');
	const [moves, setMoves] = useState([]);
	const moveRef = useRef();
	const [myPlayer, setMyPlayer] = useState(null);
	const [opponent, setOpponent] = useState({});
	const [gameState, setGameState] = useState('');
	const [turnColor, setTurnColor] = useState('white');
	
	const [config, setConfig] = useState(null);

	const [myTime, setMyTime] = useState();
	const [opponentTime, setOpponentTime] = useState();

	const decrementTime = useCallback(() => {
		if(turnColor === 'white') {
			setMyTime(myTime - 1);
			return;
		}
		setOpponentTime(opponentTime - 1);
	}, [opponentTime, turnColor, myTime]);

	const handleConfig = useCallback(() => {
		if(!config) return;
		setMyTime(config.seconds);
		setOpponentTime(config.seconds);
	}, [config])

	useEffect(() => {
		//if(gameState !== 'GAME_RUNNING') return;
		//if(!myPlayer.side === turnColor)

		const interval = setInterval(() => decrementTime(), 1000);
		return () => {
			clearInterval(interval);
		}
	}, [decrementTime])

	useEffect(() => {
		if(socket === null) return;
		//socket.emit('request', ({event: CLIENT_REQUEST.ROOM_INFO}));
		socket.emit('request', ({event: CLIENT_REQUEST.ROOM_CONFIG}));
		socket.on('response', (data) => {
			if(!data) return;
			switch(data.res) {
				case SERVER_ROOM_SUCCESS.CLIENT_MOVE_PIECE:
					console.log(data);
					setBoardState(data.fen);
					setMoves(data.history);
					setGameState(data.currentState);
					setTurnColor(data.color);
					break;
				case SERVER_ROOM_ERROR.CLIENT_MOVE_PIECE:
					console.log("not valid move!");
					break;
					
				case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM:
					handleGameData(data.data, socket.id);
					break;

				case SERVER_REQUEST_ERROR.CLIENT_REQUEST_ROOM:
					console.log(data.data);
					break;

				case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM_CONFIG:
					console.log(data.payload);
					setConfig(data.payload);
					break;

				case SERVER_ROOM_ERROR.CLIENT_LEAVE:
					setGameState(data.currentState);
					setOpponent(null);
					break;

				default: 
					break; 
			}
		})

		return () => {
			socket.emit('message', ({event: CLIENT_ROOM.LEAVE}));
			socket.off('response');
		}

	}, [socket])

	useEffect(() => {
		handleConfig();
	}, [handleConfig])

	function handleGameData(data, id) {
		if(data.player_white.id === id) {
			setMyPlayer(data.player_white);
			//setOpponent(data.player_black);
		} else {
			setMyPlayer(data.player_black)
			setOpponent(data.player_white);
		} 
	}

	function swapTurn(e) {
		e.preventDefault();
		setTurnColor(turnColor === 'white' ? 'black' : 'white');
		console.log("swapped!");
	}

	function handleInput(e) {
		e.preventDefault();
		if(gameState === "GAME_RUNNING" && myPlayer.side === turnColor) {
			//socket.emit('game', ({event: SERVER_EVENT.GAME_EVENT_TYPES.PLAYER_MAKE_MOVE, move: moveRef.current.value}));
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
							<div className={turnColor === 'black' ? 'time-active' : 'time'}>
								<p>{opponentTime ? new Date(opponentTime * 1000).toISOString().substr(14, 5) : ''}</p>
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
								<p>{myTime ? new Date(myTime * 1000).toISOString().substr(14, 5) : ''}</p>
							</div> : 
							<div className="time">
								<p>10:00</p>
							</div> }
						</div>
						<button onClick={swapTurn}>Swap turn!</button>
					</div>
		</MainContainer>
		
	)
}
