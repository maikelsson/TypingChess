import React from 'react'

export default function GameOverModal({display, onLeave}) {
  return (
    <>
      {display ?
      <>
        <div className="game-over-modal">
          <div className="content">
            <h2>Game over</h2>
            <h5>Game drawn!</h5>
            <button>Leave</button>
          </div>
        </div>
      </> : null}
    </>
    
  )
}

