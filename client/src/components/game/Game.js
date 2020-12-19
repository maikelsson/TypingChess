import React, { useContext, useEffect } from 'react';
import Chessground from 'react-chessground';

import MainContainer from '../containers/MainContainer';

import GameStatusPanel from './GameStatusPanel';
import MoveHistoryPanel from './MoveHistoryPanel';
import MoveInput from './MoveInput';
import PlayerContainer from './PlayerContainer';
import GameOverModal from './GameOverModal';

import './game.scss';

import { GameContext } from './context/GameProvider';

export default function Game() {

  const 
  { onLeave, 
    requestPlayers, 
    requestConfig, 
    players, 
    requestGameStatus, 
    status, 
    config } = useContext(GameContext);

  useEffect(() => {
    requestConfig();
    requestPlayers();
    requestGameStatus();

    return () => {
      onLeave();
    }
  }, [])

  if(!status || !config) {
    return (<>Joining game... Please stand by</>)
  }

  return (
    <MainContainer>
      <div className="board-container">
        <div className="content">
          <GameOverModal onLeave={() => {}}/>
          <Chessground orientation={players.myPlayer ? players.myPlayer.side : 'white'} viewOnly={true} fen={status.fen}/>
        </div>		
      </div>
      <div className="game-side-panel">
        <GameStatusPanel />
        <PlayerContainer reverse={true}/>
        <MoveHistoryPanel />
        <PlayerContainer reverse={false}/>
        <MoveInput />
      </div>
    </MainContainer>
    
  )
}
