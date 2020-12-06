const { Chess } = require('chess.js');

class Game {
	constructor() {
		this.game = null;
		this.player_white = null;
		this.player_black = null;
		this.state = GAME_STATE.NOT_RUNNING;
		this.currentTurn = null; 
	}

	validateMove(move, player) {
		if(this.state === GAME_STATE.NOT_RUNNING) return;
		let isValid = this.game.moves().includes(move);
		if(isValid && this.currentTurn === player) {
			this.game.move(move);
			this.checkGameStatus();
			console.log(this.game.ascii());
			this.swapTurn();
		} else {
			const err = new Error();
			err.message = "Not valid move!";
			throw err;
		}
	}

	getBoardFen() {
		return this.game.fen();
	}

	getHistory() {
		return this.game.history();
	}

	checkGameStatus() {
		if(this.game.in_checkmate) {
			let status = this.currentTurn === this.playingAsWhite ? GAME_STATE.PLAYER1_WINNER : GAME_STATE.PLAYER2_WINNER;
			this.state = status;
		}
		if(this.game.in_draw 
			|| this.game.in_threefold_repetition 
			|| this.game.insufficient_material) {
			this.state = GAME_STATE.GAME_DRAWN;
		}
		return this.state;
	}

	swapTurn() {
		this.currentTurn = this.player_white ? this.player_black : this.player_white;
	}

	setupGame() {
		this.state = "GAME_RUNNING";
		this.game = new Chess();
		this.currentTurn = this.player_white;
	}
}

const GAME_STATE = {
	NOT_RUNNING: "NOT_RUNNING",
	GAME_RUNNING: "GAME_RUNNING",
	WHITE_WINNER: "WHITE_WINNER",
	BLACK_WINNER: "BLACK_WINNER",
	GAME_DRAWN: "GAME_DRAWN"
}

module.exports = Game;