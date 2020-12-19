import React from 'react'

import { GameContext } from './context/GameProvider';

export default function TimePanel({player}) {

  const { config, status } = React.useContext(GameContext);

  if(!player) {
    return (
    <>
      <div className="time-panel">
        <div className='time'>
          <p>{new Date((config.seconds) * 1000).toISOString().substr(14, 5)}</p>
        </div>
      </div>
    </>)
  }

	return (
		<div className="time-panel">
      <div className={status.turnColor === player.side ? 'time-active' : 'time'}>
        <p>{new Date((config.seconds) * 1000).toISOString().substr(14, 5)}</p>
      </div>
    </div>
	)
}

