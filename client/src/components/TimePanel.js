import React from 'react'

export default function TimePanel({playerTime, turnColor, player}) {
	return (
		<div className="time-panel">
				{player ? 
				<div className={turnColor === player.side ? 'time-active' : 'time'}>
					<p>{playerTime ? new Date(playerTime * 1000).toISOString().substr(14, 5) : ''}</p>
				</div> : 
				<div className="time">
					<p>10:00</p>
				</div> }
			</div>
	)
}

