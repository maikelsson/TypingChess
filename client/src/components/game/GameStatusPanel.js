import React, {useContext, useEffect} from 'react'

import { GameContext } from './context/GameProvider';

export default function GameStatusPanel() {

  const { config, status } = useContext(GameContext);

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
							{status.state}
						</div>
					</div>
					<div className="bottom-row">
						<div className="player-white">
							<div className="white-circle"></div>
							{config.white} (1400)
						</div>
						<div className="player-black">
							<div className="black-circle"></div>
							{config.black} (1400)
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
