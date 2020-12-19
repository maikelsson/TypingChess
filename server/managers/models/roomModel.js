const Game = require('./gameModel');
const { v4: uuidv4} = require('uuid');
const EventEmitter = require('events');
const { messageLogger } = require('../../utils/logger');

class Room extends EventEmitter {
	constructor(timeModel, io) {
		super();
    this.name = "";
		this.id = uuidv4();		
		this.game = new Game(this.id, timeModel, io);		
		this.players = [];
    this.canJoin = this.players.length < 2 ? true : false;
    this.type = timeModel.type;
    this.time = `(${timeModel.seconds / 60} + ${timeModel.increment})`;
    
		this.on('playerCreateRoom', this.onPlayerCreateRoom);
		this.on('playerJoinRoom', this.onPlayerJoinRoom);
    this.on('playerLeaveRoom', this.onPlayerLeaveRoom);
    //this.on('playerMakeMove', this.onPlayerMakeMove);
	}

	onPlayerCreateRoom(player) {
		this.name = `${player.name}'s room`;
	}

	onPlayerJoinRoom(player, roomId, socket) {
		if(this.canJoin) {
      player.emit("joinRoom", roomId, socket);
			this.players.push(player);
			this.game.emit('newplayer', player);
		} else {
			if(!this.canJoin) {
				return new Error("Room full, can't join!");
			} else {
				return new Error("Error from room!");
			}
    }
  
	}

	onPlayerLeaveRoom(player, socket) {
		this.players = this.players.filter((p) => p.id !== player.id);
		this.game.emit('removeplayer', player);
		player.emit("leaveRoom", socket);
  }
  
  playerMakeMove(move, player) {
    try {
      this.game.emit('playerMakeMove', move, player);
    } catch (error) {
      console.error(error);
    }
  }

  getPlayers() {
    let players = {
      white: this.game.player_white,
      black: this.game.player_black
    }
    return players;
  }

  getGameStatus() {
    let status = {
      fen: this.game.getBoardFen(),
      history: this.game.getHistory(),
      state: this.game.getGameState(),
      turnColor: this.game.getTurnColor()
    }
    return status;
  }

	getGameConfig() {
		let config = {
			roomID: this.id,
			roomName: this.name,
			gameType: this.game.timeModel.type,
			seconds: this.game.timeModel.seconds,
      increment: this.game.timeModel.increment,
      white: this.game.player_white ? this.game.player_white.name : "Default white",
      black: this.game.player_black ? this.game.player_black.name : "Default black" 
		}

		return config;
	}

	getGamePlayersAndState() {
		let config = {
			white: this.game.player_white,
      black: this.game.player_black,
      state: this.game.getGameState(),
		}
		return config;
	}

}

module.exports = Room;