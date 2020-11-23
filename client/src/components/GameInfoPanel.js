import React from 'react';

export const GameInfoPanel = (props) => {
	return( 
		<div style={{
			backgroundColor: 'red',
			padding: '1em',
			width: '250px',
			justifyContent: 'center'
		}}>
			<div style={{
				backgroundColor: 'blue',
				height: '25%',
				textAlign: 'center'
			}}>
				{props.my}
			</div>
			<div style={{
				backgroundColor: 'yellow',
				height: '50%'
			}}>
				Moves
			</div>
			<div style={{
				backgroundColor: 'aqua',
				height: '25%'
			}}>
				{props.opp}
			</div>
		</div>
	)
}