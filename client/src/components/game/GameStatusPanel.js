import React from 'react'

export default function GameStatusPanel({roomConfig, myPlayer, opponent, gameState}) {
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
							{gameState}
						</div>
					</div>
					<div className="bottom-row">
						<div className="player-white">
							<div className="white-circle"></div>
							{myPlayer && opponent ? 
							<>
								{myPlayer.side === 'white' ? <>{myPlayer.name} (1500)</> : <>{opponent.name} (1500)</>}
							</> :
							 <>Default white (1400)</>}
							
						</div>
						<div className="player-black">
							<div className="black-circle"></div>
							{myPlayer && opponent ? 
							<>
								{myPlayer.side === 'black' ? <>{myPlayer.name} (1500)</> : <>{opponent.name} (1500)</>}
							</> :
							 <>Default black (1400)</>}
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
