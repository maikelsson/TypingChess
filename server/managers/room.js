const Room = require('./models/room');

class RoomManager {
	constructor() {
		this.rooms = []
	}

	createRoom(player) {
		let newRoom = new Room(player);
		player.roomId = newRoom.id;
		this.rooms.push(newRoom);
	}

	onPlayerCreateRoom(player) {
		if(!player) return;
		this.createRoom(player);
		console.log("added room", this.rooms);
	}

	onPlayerJoinRoom(player, roomId) {
		let room = this.findRoomById(roomId);
		room.addPlayerToRoom(player);
		player.roomId = room.id;
	}

	findRoomById(id) {
		return this.rooms.find((r) => r.id === id);
	}

	onPlayerLeaveRoom(player) {
		let room = this.findRoomById(player.roomId);
		if(!room) return;
		console.log(room.id);
		// Don't remove room if there is still users 
		if(room.players.length > 1) {
			room.removePlayerFromRoom(player);
		} else {
			console.log("before Room removed from list!", this.rooms);
			this.removeRoomByRoomId(room.id); 
			console.log("after Room removed from list!", this.rooms);

		}
	}

	removeRoomByRoomId(id) {
		this.rooms = this.rooms.filter((r) => r.id !== id);
	}

	getRooms() {
		return this.rooms;
	}
}

module.exports = RoomManager;