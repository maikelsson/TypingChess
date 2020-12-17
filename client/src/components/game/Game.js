import React, { useState, useRef, useContext, useEffect } from 'react';
import Chessground from 'react-chessground';

import MainContainer from '../containers/MainContainer';

import GameStatusPanel from './GameStatusPanel';
import MoveHistoryPanel from './MoveHistoryPanel';
import MoveInput from './MoveInput';
import PlayerContainer from './PlayerContainer';
import GameOverModal from './GameOverModal';

import './game.scss';

// TODO 
// create game context so the children components can use data without "prop drilling"

import { GameContext } from './context/GameProvider';

export default function Game() {

  const { requestConfig, config, onLeave } = useContext(GameContext);

  const [boardState, setBoardState] = useState('');
  const [moves, setMoves] = useState([]);
  const moveRef = useRef();
  const [myPlayer, setMyPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [gameState, setGameState] = useState('Waiting for opponent...');
  const [turnColor, setTurnColor] = useState('white');
  
  const [myTime, setMyTime] = useState();
  const [opponentTime, setOpponentTime] = useState();

  useEffect(() => {
    //requestConfig();

    return () => {
      onLeave();
    }
  }, [])

  function swapTurn(e) {
    e.preventDefault();
    setTurnColor(turnColor === 'white' ? 'black' : 'white');
    console.log("swapped!");
  }

  function handleInput(e) {
    e.preventDefault();
    if(gameState === "GAME_RUNNING" && myPlayer.side === turnColor) {
      //socket.emit('game', ({event: CLIENT_GAME.MOVE_PIECE, move: moveRef.current.value}));
    }
    //setMoves([...moves, moveRef.current.value])
    console.log(moveRef.current.value);
    e.target.reset();
  }

  return (
    <MainContainer>
      <div className="board-container">
        <div className="content">
          <GameOverModal display={true} onLeave={() => {}}/>
          <Chessground orientation={myPlayer ? myPlayer.side : 'white'} viewOnly={true} fen={boardState}/>
        </div>		
      </div>
      <div className="game-side-panel">
        <GameStatusPanel 
                          myPlayer={myPlayer}
                          opponent={opponent}
                          gameState={gameState}/>
        <PlayerContainer player={opponent} 
                      playerTime={opponentTime} 
                      turnColor={turnColor}
                      reverse={true}/>
        <MoveHistoryPanel />
        <PlayerContainer player={myPlayer} playerTime={myTime} turnColor={turnColor} reverse={false}/>
        <MoveInput handleMove={handleInput} moveRef={moveRef}/>
        <button onClick={swapTurn}>Swap turn!</button>
      </div>
    </MainContainer>
    
  )
}
