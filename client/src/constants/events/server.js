// shared between client and server

const CONNECTION_EVENT_TYPES = {
	UPDATE_CONNECTION: "UPDATE_CONNECTION",
	REMOVE_CONNECTION: "REMOVE_CONNECTION"
}

const ROOM_EVENT_TYPES = {
	PLAYER_CREATE_ROOM: "PLAYER_CREATE_ROOM",
	PLAYER_JOIN_ROOM: "PLAYER_JOIN_ROOM",
	PLAYER_LEAVE_ROOM: "PLAYER_LEAVE_ROOM",
	PLAYER_RECEIVE_MESSAGE: "PLAYER_RECEIVE_MESSAGE",
	PLAYER_JOINED_ROOM_SUCCESS: "PLAYER_JOINED_ROOM_SUCCESS"
}

const REQUEST_EVENT_TYPES = {
	PLAYER_REQUEST_ROOMS: "PLAYER_REQUEST_ROOMS"
}

const RESPONSE_EVENT_TYPES = {
	PLAYER_REQUEST_ROOMS_SUCCESS: "PLAYER_REQUEST_ROOMS_SUCCESS",
	PLAYER_REQUEST_ROOMS_ERROR: "PLAYER_REQUEST_ROOMS_SUCCESS",
	PLAYER_REQUEST_JOIN_ROOM_SUCCESS: "PLAYER_JOIN_ROOM_SUCCESS"
}

const GAME_EVENT_TYPES = {
	PLAYER_MAKE_MOVE: "PLAYER_MAKE_MOVE",
	PLAYER_RECEIVE_BOARD_STATE: "PLAYER_RECEIVE_BOARD_STATE",
	PLAYER_REQUEST_ROOM_DETAILS: "PLAYER_REQUEST_ROOM_DETAILS"
}

module.exports = {
	CONNECTION_EVENT_TYPES: CONNECTION_EVENT_TYPES,
	ROOM_EVENT_TYPES: ROOM_EVENT_TYPES,
	REQUEST_EVENT_TYPES: REQUEST_EVENT_TYPES,
	RESPONSE_EVENT_TYPES: RESPONSE_EVENT_TYPES,
	GAME_EVENT_TYPES: GAME_EVENT_TYPES
}