// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	switch(action.type) {
		case 'GET_USERS':
			return {
				...state,
				loading: false,
				users: action.payload
			}
		case 'NEW_REGISTER':
			return {
				...state,
				users: [...state.users, action.payload]
			}
		case 'LOGIN_ATTEMPT':
			return {
				...state,
				foundUser: state.users.map((u) => u.name === action.name && u.password === action.password) 
			}
		case 'USERS_ERROR':
			return {
				...state,
				error: action.payload
			}
		default:
			return state;
	}
}