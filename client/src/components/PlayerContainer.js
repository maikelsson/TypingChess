import React from 'react'
import PlayerPanel from './PlayerPanel'
import TimePanel from './TimePanel'

export default function PlayerContainer({player, turnColor, playerTime, reverse}) {
	return (
		<>
			{reverse ? 
			<>
				<TimePanel player={player} turnColor={turnColor} playerTime={playerTime}/>
				<PlayerPanel player={player}/> 
			</>
			: 
			<>
				<PlayerPanel player={player}/>
				<TimePanel player={player} turnColor={turnColor} playerTime={playerTime}/>
			</>}
		</>
				
	)
}
