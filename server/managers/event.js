const playerManager = require('./player');
const colors = require('colors');
const types = require('./models/events');


class EventManager {
	constructor() {
		this.playerManager = new playerManager.default();
		this.onMessage()
	}

	onConnection(socket) {
		MessageLogger("client connected!", "SUCCESS");
	}

	onDisconnect(socket) {
		MessageLogger("client disconnected", "DANGER");
	}

	onMessage(socket) {
		console.log(types.EVENT_TYPES[1]);
	}

}

const MessageLogger = ( message, variant ) => {

	let m = "[SERVER] ".yellow;

	switch(variant){
		case "SUCCESS":
			console.log(m + message.green)
			break; 
		case "DANGER":
			console.log(m + message.red)
			break; 
		default:
			return "";
	}
}

exports.default = EventManager;