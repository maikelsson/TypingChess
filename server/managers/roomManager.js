const Room = require('./models/roomModel');
const EventEmitter = require('events');
const { messageLogger } = require('../utils/logger');


class RoomManager extends EventEmitter{
	constructor() {
		super();
		this.rooms = []
	}

	playerCreateRoomRequest(player, socket, timeModel) {
		if(!player) return;
		try {
			let room = new Room(timeModel);
			room.emit('playerCreateRoom', player, socket);
			this.rooms.push(room);
			messageLogger("server", "Created new room!", "success");
		} catch (error) {
			messageLogger("server", error, "warning");
			return error;
		}
		
	}

	playerRequestJoinRoom(player, roomId, socket) {
		try {
			let room = this.findRoomById(roomId);
			room.emit('playerJoinRoom', player, socket);
			messageLogger("server", "player joined room!", "success")
		} catch (error) {
			return messageLogger("server", error, "danger");
		}
	}

	findRoomById(id) {
		return this.rooms.find((r) => r.id === id);
	}

	playerRequestLeaveRoom(player, socket) {
		try {
			let room = this.findRoomById(player.roomId);
			room.emit('playerLeaveRoom', player, socket);
			if(room.players.length === 0) return this.removeRoomByRoomId(room.id);
		} catch (error) {
			return messageLogger("server", error, "warning");
		}

	}

	removeRoomByRoomId(id) {
		this.rooms = this.rooms.filter((r) => r.id !== id);
	}

	getAvailableRooms() {
		let available = this.rooms.filter((room) => 
			room.players.length < 2 && 
			room.canJoin);

		return available;
	}
}

module.exports = RoomManager;