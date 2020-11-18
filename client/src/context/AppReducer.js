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
		case 'USER_LOGIN':
			return {
				...state,
				currentUser: action.payload,
				
			}
		case 'LOGOUT': 
			return {
				...state,
				isAuthenticated: action.payload
			}
		case 'USERS_ERROR':
			return {
				...state,
				error: action.payload
			}
		case 'SET_AUTH':
			return {
				...state,
				isAuthenticated: action.payload
			}
		default:
			return state;
	}
}