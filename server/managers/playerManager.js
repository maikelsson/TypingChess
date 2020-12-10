const { messageLogger } = require('../utils/logger');
const Player = require('./models/playerModel');


class PlayerManager {
	constructor() {
		this.players = [];
	}

	onConnection(socket) {
		let player = new Player("", socket.id);
		this.players.push(player); 
		messageLogger("SERVER" ,`New client connection ${player.id}`, "SUCCESS");
	}

	async onUpdateConnection(socket, username) {
		let player = new Player(username, socket.id);
		this.players = this.players.filter((p) => p.id !== socket.id);
		this.players.push(player);
		messageLogger("SERVER", "Updated client details", "SUCCESS");
	}

	onDisconnect(socket) {
		if(this.players.some(p => p.id !== socket.id)) return;
		this.players = this.players.filter((p) => p.id !== socket.id);
		messageLogger("SERVER", `Client disconnection ${socket.id}`, "DANGER");
	}

	addPlayer(player) {
		this.players.push(player);
	}

	updatePlayerDetails(player) {
		if(!player) return;	
		this.removePlayer(player.id);
		this.addPlayer(player);		
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