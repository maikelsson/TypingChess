const Game = require('./game');
const { v4: uuidv4} = require('uuid');

class Room {
	constructor(player) {
		this.name = `${player.name}'s room`;
		this.id = uuidv4();		
		this.game = new Game();		
		this.players = [];
		this.type = "rapid";
		this.time = "10+0";

		this.addPlayerToRoom(player);
	}

	getPlayers() {
		return this.players;
	}

	getGame() {
		return this.game;
	}

	getPlayerWhite() {
		return this.game.player_white;
	}

	getPlayerBlack() {
		return this.game.player_black;
	}

	addPlayerToRoom(player) {
		if(!player) return;
		this.players.push(player);
		this.game.assignPlayerSide(player);
		if(this.players.length === 2) this.game.setupGame();
	}

	removePlayerFromRoom(player) {
		this.players = this.players.filter((p) => p.id !== player.id);
		this.game.removePlayerFromGame(player);
		player.roomId = this.id;
	}
}

module.exports = Room;