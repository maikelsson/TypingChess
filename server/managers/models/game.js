const { Chess } = require('chess.js');

class Game {
	constructor(p1) {
		this.game = null;
		this.playingAsWhite = p1;
		this.playingAsBlack = null;
		this.state = GAME_STATE.NOT_RUNNING;
		this.currentTurn = this.playingAsWhite;
		console.log(this.playingAsWhite);
		console.log(this.playingAsBlack);
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
		this.currentTurn = this.playingAsWhite ? this.playingAsBlack : this.playingAsWhite;
	}

	setupGame() {
		this.state = "GAME_RUNNING";
		this.game = new Chess();
	}
}

const GAME_STATE = {
	NOT_RUNNING: "NOT_RUNNING",
	GAME_RUNNING: "GAME_RUNNING",
	PLAYER1_WINNER: "PLAYER1_WINNER",
	PLAYER2_WINNER: "PLAYER2_WINNER",
	GAME_DRAWN: "GAME_DRAWN"
}

module.exports = Game;