import React from 'react'
import { GameContext } from './context/GameProvider';

export default function GameOverModal() {

  const { status } = React.useContext(GameContext);
  
  if(!status.state === "GAME_RUNNING"){
    return (
      <>
      </>
    )
  }

  return (
    <>
      <div className="game-over-modal">
        <div className="content">
          <h2>Game over</h2>
          <h5>{status.state}</h5>
          <button onClick={console.log("Leaving game")}>Leave</button>
          <button onClick={console.log("Client rematch request")}>Play again</button>
        </div>
      </div>
    </>
    
  )
}

