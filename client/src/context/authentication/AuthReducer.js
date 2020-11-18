// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	switch(action.type) {
		case 'SET_AUTH_STATE':
			return {
				...state,
				isAuthenticated: action.payload
			}
		case 'SET_LOGGED_USER':
			return {
				...state,
				currentUser: action.payload
			}
		default:
			return state;
	}
}