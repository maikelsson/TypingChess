const playerManager = require('./player');
const colors = require('colors');
const events = require('./models/events');
const messageLogger = require('../utils/logger');

class EventManager {
	constructor() {
		this.playerManager = new playerManager.default();
	}

	onConnection(socket) {
		messageLogger("server" ,"client connected!", "SUCCESS");
	}

	onDisconnect(socket) {
		messageLogger("server", "client disconnected", "DANGER");
		this.playerManager.removePlayer(socket.id);
	}

	onMessage(socket, data) {
		if(!data || !socket) return;
		messageLogger("event", data.event, "SUCCESS");
		switch(data.event) {
			case events.CONNECTION_EVENT_TYPES.ADD_CONNECTION:
				let found = this.playerManager.findPlayerBySocketId(socket.id);
				if(found) return;
				const playerModel = {
					username: data.data.username,
					id: data.data._id,
					socketId: socket.id,
					currentRoom: ""
				}
				this.playerManager.addPlayer(playerModel);
				break;
			case events.ROOM_EVENT_TYPES.CREATE_ROOM:
				let player = this.playerManager.findPlayerBySocketId(socket.id);
				console.log(player);
			default:
				return;
		}
	}

}

exports.default = EventManager;