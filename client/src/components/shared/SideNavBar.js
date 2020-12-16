import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authentication/AuthState';

import '../main.scss';

export default function CustomNavbar() {

	const { logout } = useContext(AuthContext);

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
				<li><button onClick={handleLogout}>LogOut</button></li>
			</ul>
		</div>
	)
}
