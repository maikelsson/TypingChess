
class RoomManager {
	constructor() {
		this.rooms = []
	}

	addRoom(room) {
		if(!room) return;
		this.rooms.push(room);
		console.log("addroom", this.rooms);
	}

	addPlayerToRoom(player, roomId) {
		return this.rooms.forEach(r => {
			if(r.roomId === roomId && r.users.length < 2) {
				r.users.push(player);
				r.game.player2 = player;
			}
		})
	}

	findPlayerFromRoomById(socketId) {
		this.rooms.forEach(room => {
			return;
		})
	}

	findRoomById(id) {
		return this.rooms.find(r => r.roomId === id);
	}

	removePlayerFromRoomById(roomId, socketId) {
		let room = this.rooms.find(r => roomId === r.roomId);
		if(!room) return;
		
		// Don't remove room if there is still users 
		if(room.users.length > 1) {
			this.rooms = this.rooms.map((r) => {
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

module.exports = RoomManager;