import React, {useState, useRef} from 'react';
import CustomNavBar from './CustomNavbar';
import Chessground from 'react-chessground';

export default function Game() {

	const [moves, setMoves] = useState([]);
	const moveRef = useRef();

	function handleInput(e) {
		e.preventDefault();
		console.log("submit");
		setMoves([...moves, moveRef.current.value]);
		console.log(moves);
		e.target.reset();

	}

	return (
		<div className="home-layout">
			<CustomNavBar />
			<div className="content">
				<div className="board-container" style={{
					height: '100vh'
				}}>
					<div className="status-panel">
						<h3>Game</h3>
						<p>3</p>
						<p>asd</p>
					</div>
					<Chessground />
					<div style={{
						marginTop: "30px",
						display: "flex",
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<p>Type your move: </p>

						<form className="move-input" onSubmit={handleInput}>
							<input className="move-input" type="text" ref={moveRef}/>
							<input type="submit" hidden="true" onSubmit={handleInput}/>
						</form>
					</div>
				</div>
				<div className="side-container" style={{
					height: '90vh'
				}}>
					<div className="game-panel">
						<div className="time-panel">
							<div className="time">
								<p>15:00</p>
							</div>
						</div>
						<div className="player-panel">
							<i className="indicator-offline"></i>
							<p>Opponent</p>
						</div>
						<div className="history-panel">
							<h4>Moves</h4>
							<ol>
								{moves.map((m, i) => 
								(
									<>
										{console.log(i)}
										{i % 2 === 0 ? <li className="index">{i === 0 ? i + 1 : i / 2 + 1}.</li> : null}
										<li key={i}>{m}</li>
									</>
								))}
							</ol>
						</div>
						<div className="bottom-button-container">
							<button>S</button>
						</div>
						<div className="player-panel">
							<i className="indicator-online"></i>
							<p>My player</p>
						</div>
						<div className="time-panel">
							<div className="time">
								<p>15:00</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
