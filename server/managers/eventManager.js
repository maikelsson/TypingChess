const PlayerManager = require('./playerManager.js');
const RoomManager = require('./roomManager.js');

const { messageLogger } = require('../utils/logger');
const { SERVER_ROOM_ERROR, SERVER_ROOM_SUCCESS, SERVER_REQUEST_SUCCESS, SERVER_REQUEST_ERROR } = require('../../client/src/constants/events/server');
const { CLIENT_CONNECTION, CLIENT_ROOM, CLIENT_GAME, CLIENT_REQUEST } = require('../../client/src/constants/events/client');

class EventManager {
	constructor() {
		this.playerManager = new PlayerManager();
		this.roomManager = new RoomManager();
	}

	onConnection(socket) {
		if(!socket) return;
		this.playerManager.onConnection(socket);
	}

	onDisconnect(socket) {
		if(!socket) return;
		this.playerManager.onDisconnect(socket);
	}

	onMessage(socket, data, io) {
		if(!data || !socket) return;
		let socketPlayer = this.playerManager.findPlayerById(socket.id);
		if(!socketPlayer) return;
		switch(data.event) {
			
			case CLIENT_CONNECTION.UPDATE:
				this.playerManager.onUpdateConnection(socket, data.data.username);
				break;

			case CLIENT_ROOM.CREATE:
				if(socketPlayer.roomId !== "") return; // leave room functionality
				try{
					this.roomManager.playerCreateRoomRequest(socketPlayer, socket, data.payload);
					socket.emit('response', ({res: SERVER_ROOM_SUCCESS.CLIENT_CREATE_ROOM}))
				} catch (error) {
					messageLogger("server", "error when creating a room!", "danger");
					socket.emit('response', ({res: SERVER_ROOM_ERROR.CLIENT_CREATE_ROOM}));
				}
				break;
			
			case CLIENT_ROOM.LEAVE:
				let targetRoomId = socketPlayer.roomId;	
				if(targetRoomId === "") return;
				try {
					this.roomManager.playerRequestLeaveRoom(socketPlayer, socket);
					io.in(targetRoomId).emit('response', ({
						currentState: "PLAYER_LEFT", 
						res: SERVER_ROOM_SUCCESS.CLIENT_LEFT_ROOM
					}));
					console.log("player leaved room", socketPlayer);
				} catch (error) {
					console.log("error player leaving!");
					return;
				}
				break;
			
			case CLIENT_ROOM.JOIN:
				try {
					this.roomManager.playerRequestJoinRoom(socketPlayer, data.roomId, socket);
					let targetRoom = this.roomManager.findRoomById(data.roomId);
					io.in(socketPlayer.roomId).emit('response', ({
						data: targetRoom.getGame(), 
						res: SERVER_ROOM_SUCCESS.CLIENT_JOINED_ROOM}))
					messageLogger(data.event, "JOIN SUCCESS!", "SUCCESS");
				} catch (error) {
					messageLogger(data.event, error.message, "DANGER");
				}
				break;

			default:
				return;
		}
	}

	onRequest(socket, data, io) {
		if(!socket || !io) return;
		let player = this.playerManager.findPlayerById(socket.id);
		let targetRoom = this.roomManager.findRoomById(player.roomId);

		if(!player) {
			messageLogger("EVENT", "Couldn't find the player", "WARNING");
			return;
		}
		messageLogger("event", data.event, "success");
		switch(data.event) {

			case CLIENT_REQUEST.ROOMS:
				try {
					let availableRooms = this.roomManager.getAvailableRooms();
					socket.emit('response', ({
						data: availableRooms, 
						res: SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOMS}));
					
				} catch (error) {
					
				}
				break;

			case CLIENT_REQUEST.ROOM_INFO:
				if(player.roomId === "") return;
				try {
					io.in(player.roomId).emit('response', ({
						data: targetRoom.getGame(),
						res: SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM}))
				} catch (error) {
					console.log("error getting room info!", error);
					socket.emit('response', ({
						data: "Error getting room info!",
						res: SERVER_REQUEST_ERROR.CLIENT_REQUEST_ROOM
					}))
				}
				
				break;
			
			case CLIENT_REQUEST.ROOM_CONFIG:
				try {
					let data = targetRoom.getGameConfig();
					socket.emit('response', ({
						res: SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM_CONFIG, 
						payload: data}))
				} catch (error) {
					console.error("error when requesting config!", error);
				}
				break;

			default:
				return;
		}
	}

	onGame(socket, data, io) {
		if(!socket || !data || !io) return;
		let player = this.playerManager.findPlayerById(socket.id);
		let targetRoom = this.roomManager.findRoomById(player.roomId);
		if(!player || !targetRoom) {
			messageLogger("EVENT", data.event, "error");
			return;
		}

		switch(data.event) {
			case GAME_EVENT_TYPES.PLAYER_MAKE_MOVE:
				try {
					targetRoom.game.validateMove(data.move, player);
					io.in(player.roomId).emit('response', ({
						fen: targetRoom.game.getBoardFen(),
						history: targetRoom.game.getHistory(),
						currentState: targetRoom.game.getGameState(),
						color: targetRoom.game.getTurnColor(),
						res: "SERVER_MOVE_SUCCESS"}))

					messageLogger("EVENT", data.event, "SUCCESS");

				} catch (error) {
					socket.emit('response', ({data: error.message, res: "SERVER_MOVE_ERROR"}))
					messageLogger("EVENT", `${data.event} move error!`, "WARNING")
				}
				break;

			case GAME_EVENT_TYPES.PLAYER_REQUEST_ROOM_DETAILS:
				io.in(player.roomId).emit('response', ({data: targetRoom.getGame(), res: "RECEIVE_DETAILS_SUCCESS"}));
				
			default:
				return;
		}
	}

}

module.exports = EventManager;