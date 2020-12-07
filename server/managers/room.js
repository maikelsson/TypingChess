const { v4: uuidv4} = require('uuid');

class RoomManager {
	constructor() {
		this.rooms = []
	}

	createNewRoom(player) {

	}	

	addRoom(room) {
		if(!room) return;
		this.rooms.push(room);
		console.log("added room", this.rooms);
	}

	addPlayerToRoom(player, roomId) {
		let room = this.findRoomById(roomId);
		room.addPlayerToRoom(player);
		player.roomId = room.id;
	}

	findRoomById(id) {
		return this.rooms.find((r) => r.id === id);
	}

	removePlayerFromRoomById(player) {
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