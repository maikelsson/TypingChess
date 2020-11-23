import React from 'react';
import {GameInfoPanel} from './GameInfoPanel';
import Chessboard from 'chessboardjsx';

import "./Game.css";

export const GamePanel = (props) => {
	return (
		<div className="flex-container">
			<Chessboard />
			<GameInfoPanel my={props.myName} opp={props.opponent}/>
		</div>
	)
}