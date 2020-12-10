const EventEmitter = require('events');
const { messageLogger } = require('../../utils/logger');

class Player extends EventEmitter {
	constructor(name = "", socketId) {
		super();
		this.name = name;
		this.id = socketId
		this.roomId = "";
		this.side = 'white';

		this.on('joinRoom', this.onJoinRoom);
		this.on('leaveRoom', this.onLeaveRoom);
	}

	onJoinRoom(id, socket) {
		this.roomId = id;
		socket.join(this.roomId);
		messageLogger("PLAYER", `Client ${this.id} joined room: ${id}`, "success");
	}

	onLeaveRoom(socket) {
		socket.leave(this.roomId);
		messageLogger("PLAYER", `Client ${this.id} left the room: ${this.roomId}`, "DANGER");
		this.roomId = "";
	}
}

module.exports = Player;