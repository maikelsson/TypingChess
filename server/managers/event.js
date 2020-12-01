const PlayerManager = require('./player.js');
const RoomManager = require('./room.js');
const Game = require('./models/game');
const colors = require('colors');
const { messageLogger } = require('../utils/logger');
const { v4: uuidv4} = require('uuid');
const { CONNECTION_EVENT_TYPES, ROOM_EVENT_TYPES, REQUEST_EVENT_TYPES, RESPONSE_EVENT_TYPES } = require('../../client/src/constants/events');
const events = require('../../client/src/constants/events');

class EventManager {
	constructor() {
		this.playerManager = new PlayerManager();
		this.roomManager = new RoomManager();
	}

	// this can be trimmed ?
	onConnection(socket) {
		if(!socket) return;
		
		let initialPlayer = {
			username: "",
			id: "",
			socketId: socket.id,
			roomId: ""
		};

		console.log("onConnection", initialPlayer)
		this.playerManager.addPlayer(initialPlayer);
		messageLogger("server" ,"client connected!", "SUCCESS");

	}

	onDisconnect(socket) {
		messageLogger("server", "client disconnected", "DANGER");
		this.playerManager.removePlayer(socket.id);
	}

	onMessage(socket, data) {
		if(!data || !socket) return;
		let player = this.playerManager.findPlayerBySocketId(socket.id);
		if(!player) {
			messageLogger("EVENT", "Couldn't find the user", "WARNING");
			return;
		}
		
		messageLogger("EVENT", data.event, "SUCCESS");
		switch(data.event) {

			case CONNECTION_EVENT_TYPES.ADD_CONNECTION: // rename to update
				const playerModel = {
					username: data.data.username,
					id: data.data._id,
					socketId: socket.id,
					roomId: ""
				}
				this.playerManager.addPlayer(playerModel);
				console.log("playerManager players", this.playerManager.players);
				break;

			case ROOM_EVENT_TYPES.PLAYER_CREATE_ROOM:
				if(!player) return;
				if(player.roomId !== "") return;

				const id = uuidv4();
				console.log(id);

				let room = {
					roomId: id,
					users: [],
					state: "GAME_NOT_STARTED",
					game: new Game(player)
				}

				player.roomId = room.roomId;
				room.users.push(player);
				this.roomManager.addRoom(room);
				console.log(messageLogger("ROOM", JSON.stringify(room, null, 4), "INFO"));
				console.log(messageLogger("PLAYER", JSON.stringify(player, null, 4), "INFO"));
				socket.join(id);
				return;
			
			case ROOM_EVENT_TYPES.PLAYER_LEAVE_ROOM:	
				if(player.roomId === "") return;
				this.roomManager.removePlayerFromRoomById(player.roomId, player.socketId);
				socket.leave(player.roomId);
				player.roomId = "";
				return;

			
			default:
				return;
		}
	}

	onRequest(socket, data, io) {
		if(!socket || !io) return;
		let player = this.playerManager.findPlayerBySocketId(socket.id);
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
				player.roomId = data.data;
				this.roomManager.addPlayerToRoom(player, data.data);
				socket.join(player.roomId);
				break;

			default:
				return;
		}
	}

	onGame(socket, data, io) {
		if(!socket || !data || !io) return;
		let player = this.playerManager.findPlayerBySocketId(socket.id);
		let targetRoom = this.roomManager.findRoomById(player.roomId);
		if(!player || !targetRoom) {
			messageLogger("EVENT", "couldn't find room or player", "warning");
			return;
		}

		switch(data.event) {
			case events.GAME_EVENT_TYPES.PLAYER_MAKE_MOVE:
				try {
					targetRoom.game.validateMove(data.move, player);
					io.in(player.roomId).emit('response', ({data: targetRoom.game.getBoardFen(), res: "SERVER_MOVE_SUCCESS"}))
					messageLogger("EVENT", data.event, "SUCCESS");

				} catch (error) {
					socket.emit('response', ({data: error.message, res: "SERVER_MOVE_ERROR"}))
					messageLogger("EVENT", data.event, "WARNING")
				}
				break;
				
			default:
				return;
		}
	}

}

module.exports = EventManager;