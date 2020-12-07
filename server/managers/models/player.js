
class Player {
	constructor(name, socketId, roomId) {
		this.name = name;
		this.id = socketId;
		this.roomId = roomId;
		this.side = 'white';
	}

	getPlayerCurrentRoomId() {
		return this.roomId;
	}
}

module.exports = Player;