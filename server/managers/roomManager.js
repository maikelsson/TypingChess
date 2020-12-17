const Room = require('./models/roomModel');
const { messageLogger } = require('../utils/logger');

class RoomManager {
	constructor() {
    this.rooms = []
	}

	playerCreateRoomRequest(player, socket, timeModel, io) {
		if(!player) return;
		try {
			let room = new Room(timeModel);
			room.emit('playerCreateRoom', player, socket);
			this.rooms.push(room);
      messageLogger("server", "Created new room!", "success");
      this.playerRequestJoinRoom(player, room.id, socket, io);
		} catch (error) {
			messageLogger("server", error, "warning");
			return error;
    }
	}

	playerRequestJoinRoom(player, roomId, socket, io) {
		try {
			let room = this.findRoomById(roomId);
			room.emit('playerJoinRoom', player, roomId, socket);
      messageLogger("server", "player joined room!", "success")
      let data = room.getGameConfig();
      io.in(room.id).emit('response', ({res: "SERVER_CONFIG", payload: data}))

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
      io.in(room.id).emit('response', ({
        currentState: "PLAYER_LEFT", 
        res: SERVER_ROOM_SUCCESS.CLIENT_LEFT_ROOM
      }));
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