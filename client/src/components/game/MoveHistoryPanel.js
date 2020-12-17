import React, {useContext} from 'react'

import { GameContext } from './context/GameProvider'

export default function MoveHistoryPanel() {

  const { moveHistory, hasGameStarted } = useContext(GameContext);

	return (
		<div className="history-panel">
			<h4>History:</h4>
				<ol>
          { hasGameStarted ?
          <>
            {moveHistory.map((m, i) => 
            (
              <>
                {i % 2 === 0 ? <li key={i + 10} className="index">{i === 0 ? i + 1 : i / 2 + 1}.</li> : null}
                <li key={i}>{m}</li>
              </>
            ))} 
          </>
            : <p style={{ marginLeft: '4px', fontSize: '1rem'}}>Game not yet started...</p>
          }
				</ol>
		</div>
	)
}
