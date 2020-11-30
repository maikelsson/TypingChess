const { Chess } = require('chess.js');

class Game {
	constructor(p1) {
		this.game = new Chess();
		this.player1 = p1;
		this.player2 = null;
		this.state = GAME_STATE.NOT_RUNNING;
		console.log(this.player1);
	}

	validateMove(move) {
		let isValid = this.game.moves().includes(move);
		if(isValid) {
			this.game.move(move);
		} else {
			const err = new Error();
			err.message = "Not valid move!";
			throw err;
		}
	}

	getBoardFen() {
		return this.game.fen();
	}
}

const GAME_STATE = {
	NOT_RUNNING: "NOT_RUNNING"
}

module.exports = Game;