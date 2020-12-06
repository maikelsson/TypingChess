const Game = require('./game');
const { v4: uuidv4} = require('uuid');

class Room {
	constructor(name = "default room") {
		this.name = `${name}'s room`;
		this.id = uuidv4();		
		this.game = new Game();		
		this.players = [];
		this.type = "rapid";
		this.time = "10+0";
	}

	getPlayers() {
		return this.players;
	}

	getGame() {
		return this.game;
	}

	addPlayerToRoom(player) {
		player.roomId = this.id;
		this.players.push(player);
		if(this.game.player_white === null) {
			this.game.player_white = player;
		} else {
			this.game.player_black = player;
		}
	}

	removePlayerFromRoom(player) {
		this.players = this.players.filter((p) => p.id !== player.id);
	}
}

module.exports = Room;