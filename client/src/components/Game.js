import React, {useState, useRef, useEffect, useCallback} from 'react';
import Chessground from 'react-chessground';
import { useSocket } from '../context/socket/SocketProvider';
import MainContainer from './containers/MainContainer';
import {SERVER_REQUEST_ERROR, SERVER_REQUEST_SUCCESS, SERVER_ROOM_ERROR, SERVER_ROOM_SUCCESS} from '../constants/events/server';
import {CLIENT_GAME, CLIENT_REQUEST, CLIENT_ROOM} from '../constants/events/client';

import './styles/game.scss';

import GameStatusPanel from './GameStatusPanel';
import MoveHistoryPanel from './MoveHistoryPanel';
import MoveInput from './MoveInput';
import PlayerContainer from './PlayerContainer';
import GameOverModal from './GameOverModal';

export default function Game() {
  const socket = useSocket();
  const [boardState, setBoardState] = useState('');
  const [moves, setMoves] = useState([]);
  const moveRef = useRef();
  const [myPlayer, setMyPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [gameState, setGameState] = useState('Waiting for opponent...');
  const [turnColor, setTurnColor] = useState('white');
  
  const [config, setConfig] = useState(null);

  const [myTime, setMyTime] = useState();
  const [opponentTime, setOpponentTime] = useState();

  const decrementTime = useCallback(() => {
    if(gameState !== "GAME_RUNNING" || myTime <= 0 || opponentTime <= 0) return;
    if(myPlayer.side === turnColor) {
      setMyTime(myTime - 1);
      return;
    }
    setOpponentTime(opponentTime - 1);
  }, [opponentTime, turnColor, myTime, gameState, myPlayer]);

  const handleConfig = useCallback(() => {
    if(!config) return;
    setMyTime(config.seconds);
    setOpponentTime(config.seconds);
  }, [config])

  useEffect(() => {
    handleConfig();
  }, [handleConfig])

  useEffect(() => {
    //if(gameState !== 'GAME_RUNNING') return;
    //if(!myPlayer.side === turnColor)

    const interval = setInterval(() => decrementTime(), 1000);
    return () => {
      clearInterval(interval);
    }
  }, [decrementTime])

  useEffect(() => {
    if(socket === null) return;
    socket.emit('request', ({event: CLIENT_REQUEST.ROOM_CONFIG}));
    socket.emit('request', ({event: CLIENT_REQUEST.ROOM_PLAYERS}));
    socket.on('response', (data) => {
      if(!data) return;
      switch(data.res) {
        case SERVER_ROOM_SUCCESS.CLIENT_MOVE_PIECE:
          console.log(data);
          setBoardState(data.payload.fen);
          setMoves(data.payload.history);
          setGameState(data.payload.state);
          setTurnColor(data.payload.currentTurn);
          break;
        case SERVER_ROOM_ERROR.CLIENT_MOVE_PIECE:
          console.log(data);
          break;

        case SERVER_REQUEST_ERROR.CLIENT_REQUEST_ROOM:
          console.log(data.data);
          break;

        case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM_CONFIG:
          console.log(data.payload);
          setConfig(data.payload);
          break;

        case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOM_PLAYERS:
          console.log(data.payload);
          if(data.payload.white.id === socket.id) {
            setMyPlayer(data.payload.white);
            setOpponent(data.payload.black);
          } else {
            setMyPlayer(data.payload.black);
            setOpponent(data.payload.white);
          }
 
          setGameState(data.payload.state);
          break;

        case SERVER_ROOM_ERROR.CLIENT_LEAVE:
          // TODO handle resetting game
          setGameState(data.currentState);
          setOpponent(null);
          break;

        default: 
          break; 
      }
    })

    return () => {
      socket.emit('message', ({event: CLIENT_ROOM.LEAVE}));
      socket.off('response');
    }

  }, [socket])

  function swapTurn(e) {
    e.preventDefault();
    setTurnColor(turnColor === 'white' ? 'black' : 'white');
    console.log("swapped!");
  }

  function handleInput(e) {
    e.preventDefault();
    if(gameState === "GAME_RUNNING" && myPlayer.side === turnColor) {
      socket.emit('game', ({event: CLIENT_GAME.MOVE_PIECE, move: moveRef.current.value}));
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
        <GameStatusPanel roomConfig={config} 
                          myPlayer={myPlayer}
                          opponent={opponent}
                          gameState={gameState}/>
        <PlayerContainer player={opponent} 
                      playerTime={opponentTime} 
                      turnColor={turnColor}
                      reverse={true}/>
        <MoveHistoryPanel moves={moves}/>
        <PlayerContainer player={myPlayer} playerTime={myTime} turnColor={turnColor} reverse={false}/>
        <MoveInput handleMove={handleInput} moveRef={moveRef}/>
        <button onClick={swapTurn}>Swap turn!</button>
      </div>
    </MainContainer>
    
  )
}
