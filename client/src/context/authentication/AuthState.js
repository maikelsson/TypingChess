import React, { createContext, useReducer} from 'react';
import AuthReducer from './AuthReducer';

const initialState = {
	currentUser: null,
	isAuthenticated: false
}

export const AuthContext = createContext(initialState);

export const AuthProvider = ( {children} ) => {
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	function setAuthState(authStatus) {
		dispatch({
			type: 'SET_AUTH_STATE',
			payload: authStatus
		})
	}

	function setUserLoggedIn(user) {
		dispatch({
			type: 'SET_LOGGED_USER',
			payload: user
		})
	}

	return (
		<AuthContext.Provider value={{
			currentUser: state.currentUser,
			isAuthenticated: state.isAuthenticated,
			setAuthState,
			setUserLoggedIn
		}}>
			{children}
		</AuthContext.Provider>
	)
}