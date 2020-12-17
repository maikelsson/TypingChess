const { Chess } = require('chess.js');
const TimeModel = require('./timeModel');
const EventEmitter = require('events');

class Game extends EventEmitter {
	constructor(id, timeModel, io) {
		super();
		this.gameId = id;
    this.game = null;
		this.player_white = null;
		this.player_black = null;
		this.gameState = GAME_STATE.CAN_JOIN;
		this.currentTurn = null; 
		this.turnColor = 'white';

		this.timeModel = new TimeModel(timeModel.type, timeModel.seconds, timeModel.increment);

		this.on('newplayer', this.onNewPlayer);
    this.on('removeplayer', this.onRemovePlayer);
    this.on('playerMakeMove', this.onPlayerMove);

	}

	onNewPlayer(player) {
		if(this.player_white && this.player_black) return;
		if(!this.player_white) {
			this.player_white = player;
      player.side = 'white';
			if(this.player_black) this.setupGame();
		}
		else {
			player.side = 'black';
			this.player_black = player;
			this.setupGame();
    }
    
	}

	onRemovePlayer(player) {
		if(this.player_white === player) this.player_white = null;
		else this.player_black = null;
		this.gameState = GAME_STATE.PLAYER_LEFT;
		this.resetGame();
	}

	resetGame() {
		this.game = null;
	}

	onPlayerMove(move, player) {
		if(this.gameState === GAME_STATE.NOT_RUNNING) return;
		let validMoves = this.game.moves()
		let isValid = validMoves.includes(move);
		if(isValid && this.currentTurn === player) {
			this.game.move(move);
			this.checkGameStatus();
			this.swapTurn();
		} else {
			const err = new Error();
			err.message = "Not valid move!";
			throw err;
		}
	}

	getBoardFen() {
		if(!this.game) return;
		return this.game.fen();
	}

	getHistory() {
		if(!this.game) return;
		return this.game.history();
	}

	getGameState() {
		return this.gameState;
	}

	getTurnColor() {
		return this.turnColor;
	}

	checkGameStatus() {
		if(!this.game.game_over()) return this.gameState;
		if(this.game.in_checkmate()) {
			let status = this.currentTurn === this.player_white ? GAME_STATE.WHITE_WINNER : GAME_STATE.BLACK_WINNER;
			this.gameState = status;
			console.log(this.gameState);
		}
		
		if(this.game.in_draw() 
			|| this.game.in_threefold_repetition() 
			|| this.game.insufficient_material()) {
			this.gameState = GAME_STATE.GAME_DRAWN;
		}
		return this.gameState;
	}

	swapTurn() {
		this.currentTurn = this.currentTurn === this.player_white ? this.player_black : this.player_white;
		this.turnColor = this.turnColor === 'white' ? 'black' : 'white';
	}

	setupGame() {
		this.gameState = GAME_STATE.GAME_RUNNING;
		this.game = new Chess();
		this.currentTurn = this.player_white;
	}
}

const GAME_STATE = {
	NOT_RUNNING: "NOT_RUNNING",
	GAME_RUNNING: "GAME_RUNNING",
	WHITE_WINNER: "WHITE_WINNER",
	BLACK_WINNER: "BLACK_WINNER",
	GAME_DRAWN: "GAME_DRAWN",
	PLAYER_LEFT: "PLAYER_LEFT",
	CAN_JOIN: "CAN_JOIN"
}

module.exports = Game;