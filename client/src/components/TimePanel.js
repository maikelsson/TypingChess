import React from 'react'

export default function TimePanel({playerTime, turnColor, player}) {
	return (
		<div className="time-panel">
				{player ? 
				<div className={turnColor === 'black' ? 'time-active' : 'time'}>
					<p>{playerTime ? new Date(playerTime * 1000).toISOString().substr(14, 5) : ''}</p>
				</div> : 
				<div className="time">
					<p>10:00</p>
				</div> }
			</div>
	)
}

<div className="game-status-panel">
			<div className="top-row">
				<div className="logo">
					TC
				</div>
				<div className="room-info">
					{15+15} • Casual • Classic <br/>
					Game Running
				</div>
			</div>
			<div className="bottom-row">
				<div className="player-white">
					<div className="white-circle">

					</div>
					Player white (1400)
				</div>
				<div className="player-black">
					<div className="black-circle">

					</div>
					Player black (1230)
				</div>
			</div>
		</div>
