import React from 'react'

import { GameContext } from './context/GameProvider';

export default function GameOverModal({onLeave}) {

  const { status } = React.useContext(GameContext);
  

  if(!status.state !== "GAME_OVER"){
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
            <h5>Game drawn!</h5>
            <button>Leave</button>
          </div>
        </div>
    </>
    
  )
}

