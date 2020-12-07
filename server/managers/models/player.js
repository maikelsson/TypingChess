
class Player {
	constructor(name, socketId) {
		this.name = name;
		this.id = socketId;
		this.roomId = "";
		this.side = 'white';
	}
}

module.exports = Player;