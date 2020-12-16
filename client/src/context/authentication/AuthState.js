import React, { createContext, useReducer} from 'react';
import AuthReducer from './AuthReducer';
import axios from 'axios';
import { validatePassword } from '../../utils/validation';

const authenticationState = {
	authenticatedUser: null,
	isAuthenticated: false,
}

export const AuthContext = createContext(authenticationState);

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, authenticationState);

	async function register(name, password, confirmPassword) {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const isValid = validatePassword(password, confirmPassword);
		if(!isValid) {
			var error = new Error();
			error.message = "Passwords didn't match or password is too short";
			throw error; 
		}
		else {
			let user = {
				username: name,
				password: password
			};

			try {
				const res = axios.post('/api/v1/users', user, config);
			} catch (err) {
				throw err.message;
			}
		}
	}

	async function login(name, password) {
		let user;
		try {
			const res = await axios.get('/api/v1/users');
			user = res.data.data.find(o => o.username === name && o.password === password);
		} catch (err) {
			throw err;
		}
		
		if(!user) {
			let error = new Error();
			error.message = "Couldn't find user"
			throw error;
		} else {
			return dispatch({
				type: 'LOGIN',
				payload: user,
			});
		}
	}

	function logout() {
		return dispatch({
			type: 'LOGOUT',
			payload: null
		})
	}

	return (
		<AuthContext.Provider value={{
			authenticatedUser: state.authenticatedUser,
			isAuthenticated: state.isAuthenticated,
			login,
			register,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	)
}