import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/authentication/AuthState';
import MainContainer from './containers/MainContainer';

export const PrivateRoute = ({component: Component, ...rest}) => {
	const { isAuthenticated } = useContext(AuthContext);
	useEffect(() => {
		console.log(isAuthenticated);
	})

	return(
		<Route {...rest} render={(props) => (
			isAuthenticated
				? <Component {...props} />
				: <Redirect to='/login' />
		)}/>
	)
}