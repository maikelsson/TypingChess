import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import {useSocket} from '../context/socket/SocketProvider';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { ROOM_EVENT_TYPES, GAME_EVENT_TYPES } from '../constants/events';
import { useHistory } from 'react-router-dom';
import Chessboard from 'chessboardjsx';
import CustomNavbar from './CustomNavbar';


export default function Game() {

	const { authenticatedUser } = useContext(AuthContext);
	const socket = useSocket();
	const history = useHistory();
	const [boardState, setBoardState] = useState('start');
	const [error, setError] = useState('');
	const moveRef = useRef();
	const [move, setMove] = useState('')

	useEffect(() => {
		if(socket === null) return;
		
		socket.on('response', (data) => {
			if(!data) return;
			console.log("got response");
			switch(data.res) {
				case "SERVER_MOVE_SUCCESS":
					console.log(data.data);
					setBoardState(data.data);
					return;
				case "SERVER_MOVE_ERROR":
					setError(data.data);
					return;
				default:
					return;
			}
		});

		return () => socket.off();

	}, [socket]);

	function handleLeave(e) {
		e.preventDefault();
		socket.emit('message', ({event: ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM}))
		history.push('/');
	}

	function handleMove(e) {
		e.preventDefault();
		socket.emit('game', ({event: GAME_EVENT_TYPES.PLAYER_MAKE_MOVE, move: moveRef.current.value}));
	}

	return (
		<>
			<Container style={{
				alignItems: 'center'
			}}>
				<CustomNavbar />
				<div style={{
					minHeight: '5vh',
					justifyItems: 'center',
					justifyContent: 'center',
					display: 'flex'
				}}>
					GameView! <Button onClick={handleLeave}>Leave</Button>
					<Button>Move!</Button>
				</div>
				{error ?? <p>{error}</p>}
				<div style={board}>
					<Chessboard position={boardState}/>
					<div style={{
						backgroundColor: "red",
						minHeight: "50vh",
						minWidth: '30vh',
						justifyContent: 'center',
						display: 'flex'
					}}>
						<p>test</p>
						<p>test</p>
						<p>test</p>
					</div>
				</div>
				<form onSubmit={handleMove} style={{
					justifyContent: 'center',
					display: 'flex'
				}}>
					<input type="text" ref={moveRef}></input>
					<input type="submit" hidden={true} onSubmit={handleMove} ></input>
				</form>
			</Container>
		</>
	)
}

const board = {
	display: "flex",
	alignItems: 'center',
	justifyContent: 'center'
}
