const PlayerManager = require('./playerManager.js');
const RoomManager = require('./roomManager.js');
const MessageManager = require('./messageManager.js');

const { messageLogger } = require('../utils/logger');
const { SERVER_ROOM_ERROR, SERVER_ROOM_SUCCESS, SERVER_REQUEST_SUCCESS, SERVER_REQUEST_ERROR } = require('../../client/src/constants/events/server');
const { CLIENT_CONNECTION, CLIENT_ROOM, CLIENT_GAME, CLIENT_REQUEST } = require('../../client/src/constants/events/client');

class EventManager {
	constructor(io) {
    this.io = io;
		this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
    this.messageManager = new MessageManager(this.io);
	}

	onConnection(socket) {
		if(!socket) return;
		this.playerManager.onConnection(socket);
	}

	onDisconnect(socket) {
		if(!socket) return;
		this.playerManager.onDisconnect(socket);
	}

	async onMessage(socket, data, io) {
		if(!data || !socket) return;
		let socketPlayer = this.playerManager.findPlayerById(socket.id);
		if(!socketPlayer) return;
		switch(data.event) {
			
			case CLIENT_CONNECTION.UPDATE:
				this.playerManager.onUpdateConnection(socket, data.data.username);
				break;

			case CLIENT_ROOM.CREATE:
				if(socketPlayer.roomId !== "") return; // leave room functionality
				try {
          await this.roomManager.playerCreateRoomRequest(socketPlayer, socket, data.payload);
				} catch (error) {
					messageLogger("server", "error when creating a room!", "danger");
					socket.emit('response', ({res: SERVER_ROOM_ERROR.CLIENT_CREATE_ROOM}));
				}
				break;
			
			case CLIENT_ROOM.LEAVE:
				let targetRoomId = socketPlayer.roomId;	
				if(targetRoomId === "") return;
				try {
          this.roomManager.playerRequestLeaveRoom(socketPlayer, socket);
          this.messageManager.sendMessageToRoom(targetRoomId, "", SERVER_ROOM_SUCCESS.CLIENT_LEFT_ROOM)
					console.log("player leaved room", socketPlayer);
				} catch (error) {
					console.log("error player leaving!");
					return;
				}
				break;
			
			case CLIENT_ROOM.JOIN:
				try {
					this.roomManager.playerRequestJoinRoom(socketPlayer, data.payload, socket);
					messageLogger(data.event, "JOIN SUCCESS!", "SUCCESS");
				} catch (error) {
					messageLogger(data.event, error.message, "DANGER");
				}
				break;

			default:
				return;
		}
	}

	onRequest(socket, data, io) {
		if(!socket || !io) return;
		let player = this.playerManager.findPlayerById(socket.id);
		let targetRoom = this.roomManager.findRoomById(player.roomId);

		if(!player) {
			messageLogger("EVENT", "Couldn't find the player", "WARNING");
			return;
		}
		messageLogger("event", data.event, "success");
		switch(data.event) {

			case CLIENT_REQUEST.ROOMS:
				try {
          let availableRooms = this.roomManager.getAvailableRooms();
          this.messageManager.sendMessageToSocket(socket, 
            availableRooms, SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOMS)
				} catch (error) {
					console.error("cant receive rooms!");
				}
				break;

			

			default:
				return;
		}
	}

	onGame(socket, data, io) {
		if(!socket || !data || !io) return;
		let player = this.playerManager.findPlayerById(socket.id);
		let targetRoom = this.roomManager.findRoomById(player.roomId);
		if(!player || !targetRoom) {
			messageLogger("EVENT", data.event, "error");
			return;
		}

		switch(data.event) {
      
      case CLIENT_GAME.MOVE_PIECE:
				try {
          targetRoom.playerMakeMove(data.move, player);
          let status = targetRoom.getGameStatus();
          this.messageManager.sendMessageToRoom(player.roomId, status, "GAME_STATUS_OK");
					messageLogger("EVENT", data.event, "SUCCESS");
				} catch (error) {
					socket.emit('response', ({data: error, res: SERVER_ROOM_ERROR.CLIENT_MOVE_PIECE}))
					messageLogger("EVENT", `${data.event} move error!, ${error}`, "WARNING")
				}
        break;

        case CLIENT_REQUEST.ROOM_PLAYERS:
				try {
          let data = targetRoom.getPlayers();
          this.messageManager.sendMessageToRoom(player.roomId, data, "RECEIVE_PLAYERS_OK", "players")
					messageLogger("server", "Client requested room players successfully", "success");
				} catch(err) {
					console.error("error request room players!");
				}
				break;
			
			case CLIENT_REQUEST.ROOM_CONFIG:
				try {
          console.log(targetRoom, "targetRoom!");
          let data = targetRoom.getGameConfig();
          this.messageManager.sendMessageToRoom(player.roomId, data, "GAME_CONFIG_OK")
				} catch (error) {
					console.error("error when requesting config!", error);
				}
        break;
        
      case "CLIENT_REQ_GAME_STATUS":
        try {
          let data = targetRoom.getGameStatus();
          this.messageManager.sendMessageToRoom(player.roomId, data, "GAME_STATUS_OK");
        } catch {
          console.error("cant send game config");
        }
        break;
				
			default:
				return;
		}
	}

}

module.exports = EventManager;