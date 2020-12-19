import React, { useEffect, useState, useContext } from 'react'

import { GameContext } from './context/GameProvider';

export default function TimePanel({player}) {

  const { config, status } = useContext(GameContext);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(config.seconds)
  }, [])

  const formatTime = () => {
    return new Date((time) * 1000).toISOString().substr(14, 5)
  }

  useEffect(() => {
    if(!player) return;
    if(player.side === status.turnColor && status.state === "GAME_RUNNING") {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } 
  })

  if(!player) {
    return (
    <>
      <div className="time-panel">
        <div className='time'>
          <p>{formatTime(time)}</p>
        </div>
      </div>
    </>)
  }

	return (
		<div className="time-panel">
      <div className={status.turnColor === player.side ? 'time-active' : 'time'}>
        <p>{formatTime(time)}</p>
      </div>
    </div>
	)
}

