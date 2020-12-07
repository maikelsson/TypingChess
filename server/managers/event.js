const PlayerManager = require('./player.js');
const Player = require('./models/player');

const RoomManager = require('./room.js');
const Room = require('./models/room');

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
		let defaultPlayer = new Player("", socket.id, "");
		console.log("onConnection", defaultPlayer);
		this.playerManager.players.push(defaultPlayer);
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
			case CONNECTION_EVENT_TYPES.ADD_CONNECTION: // rename to update
				let p = new Player(data.data.username, socket.id, "");
				this.playerManager.updatePlayerDetails(p);
				console.log("playerManager players", this.playerManager.players);
				break;

			case ROOM_EVENT_TYPES.PLAYER_CREATE_ROOM:
				if(player.roomId !== "") return;

				let room = new Room(player.name);
				room.addPlayerToRoom(player);
				this.roomManager.addRoom(room);
				socket.join(player.roomId);
				return;
			
			case ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM:	
				if(player.roomId === "") return;
				this.roomManager.removePlayerFromRoomById(player);
				socket.leave(player.roomId);
				player.roomId = "";
				console.log("player leaved room", player);
				return;
			
			case ROOM_EVENT_TYPES.PLAYER_JOINED_ROOM_SUCCESS:
				

			default:
				return;
		}
	}

	onRequest(socket, data, io) {
		if(!socket || !io) return;
		let player = this.playerManager.findPlayerById(socket.id);
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
				if(player.roomId !== "") return;
				this.roomManager.addPlayerToRoom(player, data.data);
				socket.join(player.roomId);
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
					io.in(player.roomId).emit('response', ({data: targetRoom.game.getBoardFen(), res: "SERVER_MOVE_SUCCESS", history: targetRoom.game.getHistory()}))
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