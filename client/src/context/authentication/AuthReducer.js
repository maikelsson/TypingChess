// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	switch(action.type) {
		case 'LOGIN':
			return {
				...state,
				authenticatedUser: action.payload,
				isAuthenticated: true,
			}
		case 'LOGIN_ERROR':
			return {
				...state,
				authenticatedUser: action.payload,
				isAuthenticated: false
			}
		case 'LOGOUT':
			return {
				...state,
				authenticatedUser: action.payload,
				isAuthenticated: false
			}
		default:
			return state;
	}
}