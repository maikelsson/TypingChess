const Game = require('./gameModel');
const { v4: uuidv4} = require('uuid');
const EventEmitter = require('events');
const { messageLogger } = require('../../utils/logger');

class Room extends EventEmitter {
	constructor(timeModel) {
		super();
		this.name = "";
		this.id = uuidv4();		
		this.game = new Game(this.id, timeModel);		
		this.players = [];
    this.canJoin = this.players.length < 2 ? true : false;
    this.type = timeModel.type;
    this.time = `(${timeModel.seconds / 60} + ${timeModel.increment})`;

		this.on('playerCreateRoom', this.onPlayerCreateRoom);
		this.on('playerJoinRoom', this.onPlayerJoinRoom);
    this.on('playerLeaveRoom', this.onPlayerLeaveRoom);
    //this.on('playerMakeMove', this.onPlayerMakeMove);
	}

	onPlayerCreateRoom(player, socket) {
		this.name = `${player.name}'s room`;
		this.onPlayerJoinRoom(player, socket);
	}

	onPlayerJoinRoom(player, socket) {
		if(this.canJoin) {
			this.players.push(player);
			this.game.emit('newplayer', player);
			player.emit("joinRoom", this.id, socket);
		} else {
			if(this.players.length > 1) {
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
      return;
    } catch (error) {
      console.error(error);
    }
  }

  getGameStatus() {
    let status = {
      fen: this.game.getBoardFen(),
      history: this.game.getHistory(),
      state: this.game.getGameState(),
      currentTurn: this.game.getTurnColor()
    }
    return status;
  }

	getGameConfig() {
		let config = {
			roomID: this.id,
			roomName: this.name,
			gameType: this.game.timeModel.type,
			seconds: this.game.timeModel.seconds,
			increment: this.game.timeModel.increment
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
		this.game.emit('newplayer', player);
	}

	removePlayerFromRoom(player) {
		this.players = this.players.filter((p) => p.id !== player.id);
		this.game.emit('removeplayer', player);
	}
}

module.exports = Room;