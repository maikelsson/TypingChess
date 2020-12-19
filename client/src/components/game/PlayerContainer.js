import React from 'react'
import PlayerPanel from './PlayerPanel'
import TimePanel from './TimePanel'

import { GameContext } from './context/GameProvider'

export default function PlayerContainer({reverse}) {

  const { status, players } = React.useContext(GameContext);

	return (
		<>
			{reverse ? 
			<>
				<TimePanel player={players.opponent}/>
				<PlayerPanel player={players.opponent}/> 
			</>
			: 
			<>
				<PlayerPanel player= {players.myPlayer}/>
				<TimePanel player= {players.myPlayer}/>
			</>}
		</>
				
	)
}
