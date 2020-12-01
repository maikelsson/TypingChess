import React, { useContext, useState, useEffect } from 'react';
import { Navbar, NavDropdown, Button, Nav, Modal, Spinner } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authentication/AuthState';
import * as EVENTS from '../constants/events';

import {useSocket} from '../context/socket/SocketProvider';
import RoomList from './RoomList';

export default function CustomNavbar() {

	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const [rooms, setRooms] = useState([]);

	const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	const socket = useSocket();
	const history = useHistory();
	const { logout } = useContext(AuthContext);

	useEffect(() => {
		if(!socket) return;
		
		socket.on('response', (data) => {
			if(!data) return;
			switch(data.res) {
				case EVENTS.RESPONSE_EVENT_TYPES.PLAYER_REQUEST_ROOMS_SUCCESS:
					console.log(data.res, data.data);
					setRooms(data.data);
					break;
				case EVENTS.RESPONSE_EVENT_TYPES.PLAYER_REQUEST_JOIN_ROOM_SUCCESS:
					console.log("joining!");
					break;
				default:
					break;
			}
			setLoading(false);
		})

		return () => socket.off('response')
	}, [socket, history])

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
		<>
			<Navbar sticky="top" collapseOnSelect expand="sm" bg="dark" variant="dark" style={{
				borderRadius: "10px"
			}}>
				<Navbar.Brand to="/">TypeChess</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/">
							Home
						</Nav.Link>
						<NavDropdown title="Play" id="collasible-nav-dropdown">
							<NavDropdown.Item as={Button} onClick={handleCreateGame}>Create New</NavDropdown.Item>
							<NavDropdown.Item as={Button} onClick={handleShow}>Rooms</NavDropdown.Item>

							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link as={Link} eventKey={2} onClick={handleLogout} to="/">
							Log Out
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>

				<Modal show={show} onHide={handleClose} onEntering={() => console.log("entering!")}>
					<Modal.Header closeButton>
						<Modal.Title>{loading
													? <p>Loading Rooms...</p>
													: <p>Rooms</p>} 
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{!loading 
							? <RoomList rooms={rooms} handleJoinRoom={handleJoinRoom}></RoomList>
							: <Spinner animation="border" variant="primary" />
						}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleRefresh}>Refresh</Button>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
      	</Modal>
			</Navbar>
		</>
	)
}
