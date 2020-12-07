const PlayerManager = require('./player.js');
const Player = require('./models/player');

const RoomManager = require('./room.js');

const { messageLogger } = require('../utils/logger');
const { CONNECTION_EVENT_TYPES, ROOM_EVENT_TYPES, REQUEST_EVENT_TYPES, RESPONSE_EVENT_TYPES, GAME_EVENT_TYPES } = require('../../client/src/constants/events/server');

class EventManager {
	constructor() {
		this.playerManager = new PlayerManager();
		this.roomManager = new RoomManager();
	}

	// this can be trimmed ?
	onConnection(socket) {
		if(!socket) return;
		let defaultPlayer = new Player("", socket.id);
		console.log("onConnection", defaultPlayer);
		this.playerManager.addPlayer(defaultPlayer);
		messageLogger("server" ,`New client connection ${defaultPlayer.id}`, "SUCCESS");
	}

	onDisconnect(socket) {
		messageLogger("server", `Client disconnection ${socket.id}`, "DANGER");
		this.playerManager.removePlayer(socket.id);
	}

	onMessage(socket, data) {
		if(!data || !socket) return;
		let player = this.playerManager.findPlayerById(socket.id);
		
		if(!player) {
			messageLogger("EVENT", "Couldn't find the user", "WARNING");
			return;
		}
		
		messageLogger("EVENT", data.event, "SUCCESS");

		switch(data.event) {
			case CONNECTION_EVENT_TYPES.UPDATE_CONNECTION: // rename to update
				let targetPlayer = new Player(data.data.username, socket.id);
				this.playerManager.updatePlayerDetails(targetPlayer);
				console.log("playerManager players", this.playerManager.players);
				break;

			case ROOM_EVENT_TYPES.PLAYER_CREATE_ROOM:
				if(player.roomId !== "") return; // leave room functionality

				this.roomManager.onPlayerCreateRoom(player);
				socket.join(player.roomId);
				return;
			
			case ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM:	
				if(player.roomId === "") return;
				socket.to(player.roomId).emit('response', ({currentState: "PLAYER_LEFT", res: "PLAYER_LEFT_ROOM"}));
				this.roomManager.onPlayerLeaveRoom(player);
				socket.leave(player.roomId);
				console.log("player leaved room", player);
				return;
		
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

			case REQUEST_EVENT_TYPES.PLAYER_REQUEST_ROOMS:
				socket.emit('response', ({data: this.roomManager.getRooms(), res: RESPONSE_EVENT_TYPES.PLAYER_REQUEST_ROOMS_SUCCESS}));
				break;

			case ROOM_EVENT_TYPES.PLAYER_JOIN_ROOM:
				//if(!player.room) return;
				this.roomManager.onPlayerJoinRoom(player, data.roomId);
				socket.join(player.roomId);
				break;

			case ROOM_EVENT_TYPES.PLAYER_JOINED_ROOM_SUCCESS:
				if(player.roomId === "") return;
				io.in(player.roomId).emit('response', (
					{white: targetRoom.getPlayerWhite(), 
						black: targetRoom.getPlayerBlack(),
						currentState: targetRoom.game.getGameState(), 
						res: 'JOIN_ROOM_SUCCESS'}))

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