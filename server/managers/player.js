
class PlayerManager {
	constructor() {
		this.players = [];
	}

	addPlayer(player) {
		this.players.push(player);
		console.log("player manager", this.players);
	}

	removePlayer(socketId) {
		this.players = this.players.filter((p) => p.socketId !== socketId);
		console.log("playerManager", this.players);
	}

	findPlayerBySocketId(socketId) {
		return this.players.find((p) => p.socketId === socketId);
	}

}

exports.default = PlayerManager;