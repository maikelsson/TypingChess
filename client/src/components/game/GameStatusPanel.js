import React, {useContext, useEffect} from 'react'

import { GameContext } from './context/GameProvider';

export default function GameStatusPanel({ myPlayer, opponent, gameState }) {

  const { config } = useContext(GameContext);

	return (
		<>
			{config ? 
			<>
				<div className="game-status-panel">
					<div className="top-row">
						<div className="logo">
							TC
						</div>
						<div className="room-info">
							{config.seconds / 60}+{config.increment} • Casual • {config.gameType} <br/>
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
