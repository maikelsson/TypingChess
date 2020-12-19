import React from 'react'
import { GameContext } from './context/GameProvider';

export default function MoveInput() {

  const { makeMove, status, players } = React.useContext(GameContext);
  const moveRef = React.useRef();


  function handleInput(e) {
    e.preventDefault();
    //if(status.gameState === "GAME_RUNNING" && status.turnColor === players.myPlayer.side) {
    //  makeMove(moveRef.current.value);
    //}
    makeMove(moveRef.current.value);
    console.log(moveRef.current.value);
    e.target.reset();
  }

	return (
		<div style={{
			marginTop: "30px",
			display: "flex",
			alignItems: 'center',
			justifyContent: 'center',
		}}>
			<p>Type your move: </p>
			<form className="move-input" onSubmit={handleInput}>
				<input className="move-input" type="text" ref={moveRef}/>
				<input type="submit" hidden={true}/>
			</form>
		</div>
	)
}
