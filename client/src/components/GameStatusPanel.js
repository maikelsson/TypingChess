import React from 'react'

export default function GameStatusPanel({roomConfig}) {
	return (
		<>
			{roomConfig ? 
			<>
				<div className="game-status-panel">
					<div className="top-row">
						<div className="logo">
							TC
						</div>
						<div className="room-info">
							{roomConfig.seconds / 60}+{roomConfig.increment} • Casual • {roomConfig.gameType} <br/>
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
			</> 
			: 
			<>
				<p>Loading config...</p>
			</>}
		</>
	)
}
