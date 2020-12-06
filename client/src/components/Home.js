import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/authentication/AuthState'
import MainContainer from './containers/MainContainer';

export default function Home() {
	const { authenticatedUser } = useContext(AuthContext);

	useEffect(() => {
		console.log(authenticatedUser);

	}, [authenticatedUser])

	return(
		<>
			<MainContainer>
				Home!
			</MainContainer>
		</>
	)
}