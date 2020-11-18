import React, { createContext, useReducer} from 'react';
import AppReducer from './AppReducer';
import axios from 'axios'

// initial state
const initialState = {
	users: [],
	error: null,
	loading: true
}

// create Context
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	async function getUsers() {
		try {
			const res = await axios.get('/api/v1/users')
			dispatch({
				type: 'GET_USERS',
				payload: res.data.data
			})
		} catch (err) {
			dispatch({
				type: 'USERS_ERROR',
				payload: err.res.data.error
			})
		}
	}

	async function addRegisteredUser(user) {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		
		try {
			const res = await axios.post('/api/v1/users', user, config);
			dispatch({
				type: 'NEW_REGISTER',
				payload: res.data.data
			});
		} catch (err) {
			dispatch({
				type: 'USERS_ERROR',
				payload: err.err
			  });
		}

	}

	return (
		<GlobalContext.Provider value={{
			users: state.users,
			error: state.error,
			loading: state.loading,
			addRegisteredUser,
			getUsers,
		}}>
			{children}
		</GlobalContext.Provider>
	)
}
