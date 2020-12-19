const Room = require('./models/roomModel');
const { messageLogger } = require('../utils/logger');

class RoomManager {
	constructor() {
    this.rooms = []
	}

	async playerCreateRoomRequest(player, socket, timeModel) {
		if(!player) return;
		try {
			let room = new Room(timeModel);
			room.emit('playerCreateRoom', player);
			this.rooms.push(room);
      messageLogger("server", "Created new room!", "success");
      this.playerRequestJoinRoom(player, room.id, socket);
		} catch (error) {
			messageLogger("server", error, "warning");
			return error;
    }
	}

	playerRequestJoinRoom(player, roomId, socket) {
		try {
			let room = this.findRoomById(roomId);
			room.emit('playerJoinRoom', player, roomId, socket);
      messageLogger("server", "player joined room!", "success")
      //let data = room.getGameConfig();
      //io.in(room.id).emit('response', ({res: "GAME_CONFIG_OK", payload: data}))

		} catch (error) {
			return messageLogger("server", error, "danger");
		}
	}

  
	playerRequestLeaveRoom(player, socket) {
    try {
      let room = this.findRoomById(player.roomId);
			room.emit('playerLeaveRoom', player, socket);
      if(room.players.length === 0) return this.removeRoomByRoomId(room.id);
      io.in(room.id).emit('response', ({
        currentState: "PLAYER_LEFT", 
        res: "CLIENT_DISCONNECT"
      }));
		} catch (error) {
      return messageLogger("server", error, "warning");
    }
	}
  
  findRoomById(id) {
    return this.rooms.find((r) => r.id === id);
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