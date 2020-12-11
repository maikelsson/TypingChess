import React from 'react'

export default function PlayerPanel({player}) {
	return (
		<>
			<div className="player-panel">
				<i className={player ? 'indicator-online' : 'indicator-offline'}></i>
				<p>{player ? player.name : 'player'}</p>
			</div>
		</>
	)
}
