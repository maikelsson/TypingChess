import React, { useContext } from 'react';
import { Navbar, NavDropdown, Button, Nav } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authentication/AuthState';

import {useSocket} from '../context/socket/SocketProvider';

export default function CustomNavbar() {

	const socket = useSocket();
	const history = useHistory();

	const { logout } = useContext(AuthContext);

	async function handleLogout(e) {
		e.preventDefault();
		await logout();
	}

	function handleCreateGame() {
		socket.emit('message', ({event: "CREATE_ROOM"}));
	}

	return (
		<>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand to="/">TypeChess</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/">
							Home
						</Nav.Link>
						<Nav.Link>Forum</Nav.Link>
						<NavDropdown title="Play" id="collasible-nav-dropdown">
							<NavDropdown.Item as={Link} onClick={handleCreateGame}>Create New</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">Rooms</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link as={Link} eventKey={2} onClick={handleLogout}>
							Log Out
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</>
	)
}
