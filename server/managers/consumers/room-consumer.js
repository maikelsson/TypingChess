const RoomManager = require('../room.js');

class RoomManagerConsumer {
	constructor() {
		this.roomManagerConsumer = new RoomManager();
	}

	consumerAddRoom(room) {
		this.roomManagerConsumer.addRoom();
	}

	findPlayerFromRoomById(socketId) {
		this.rooms.forEach(room => {
			return;
		})
	}

	removePlayerFromRoomById(roomId, socketId) {
		let room = this.rooms.find(r => roomId === r.roomId);
		if(!room) return;
		
		// Don't remove room if there is still users 
		if(room.users.length > 1) {
			this.rooms = this.rooms.map((r) => {
				console.log(r.users);
				r.users = r.users.filter((u) => u.socketId !== socketId);
				return r;
			});
		} else {
			console.log("removeById", JSON.stringify(this.rooms));
			this.removeRoom(roomId); 
		}
	}

	removeRoom(roomId) {
		this.rooms = this.rooms.filter(r => r.roomId !== roomId);
	}

	getRooms() {
		return this.rooms;
	}
}

module.exports = RoomManagerConsumer;