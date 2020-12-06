const { messageLogger } = require('../utils/logger');

class PlayerManager {
	constructor() {
		this.players = [];
	}

	updatePlayerDetails(player) {	
		this.removePlayer(player.id);
		this.players.push(player);		
		messageLogger("debug", "Player added to list", "info");
	}

	removePlayer(id) {
		this.players = this.players.filter((initialPlayer) => initialPlayer.id !== id);
		messageLogger("debug", "Player removed from list!", "info");
	}

	findPlayerById(id) {
		return this.players.find((player) => player.id === id);
	}
}

module.exports = PlayerManager;