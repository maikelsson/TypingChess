import React, {useState, useRef} from 'react';
import CustomNavBar from './SideNavBar';
import Chessground from 'react-chessground';
import MainContainer from './containers/MainContainer';

import './styles/game.scss';

export default function Game() {

	const [boardState, setBoardState] = useState('start');
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
		<MainContainer>
			<div className="board-container">
					<div className="status-panel">
						<h3>Game</h3>
						<p>You</p>
						<p>vs</p>
						<p>Opponent</p>
					</div>
					<Chessground fen={moves}/>
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
				<div className="side-panel" style={{
					backgroundColor: "#24292E",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignContent: "center",
					alignItems: "center"

				}}>
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
							<h4>History:</h4>
							<ol>
								{moves.map((m, i) => 
								(
									<>
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
		</MainContainer>
		
	)
}
