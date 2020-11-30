const { messageLogger } = require('../utils/logger');

class PlayerManager {
	constructor() {
		this.players = [];
	}

	addPlayer(player) {
		let initialPlayer = this.findPlayerBySocketId(player.socketId);
		if(!initialPlayer) {
			this.players.push(player);
		}	else {
			// removing default entry from players and adding new with values received from client
			this.removePlayer(player.socketId);
			this.players.push(player);
		}

		messageLogger("debug", "Player added to list", "info");
	}

	removePlayer(socketId) {
		this.players = this.players.filter((initialPlayer) => initialPlayer.socketId !== socketId);
		messageLogger("debug", "player removed from list!", "info");
	}

	findPlayerBySocketId(socketId) {
		return this.players.find((initialPlayer) => initialPlayer.socketId === socketId);
	}



}

module.exports = PlayerManager;