import React, { createContext, useReducer, useEffect, useCallback } from 'react'
import { useSocket } from '../../../context/socket/SocketProvider';
import GameReducer from './GameReducer';

import * as e from '../../../constants/events/client';

const gameState = {
  config: null,
  hasGameEnded: false,
  hasGameStarted: false,
  moveHistory: [],
  fen: '',
  turnColor: 'white',
  playerWhite: null,
  playerBlack: null
}

export const GameContext = createContext(gameState);

export const GameProvider = ({ children }) => {

  const [state, dispatch] = useReducer(GameReducer, gameState);
  const socket = useSocket();

  useEffect(() => {
    if(!socket) return;

    socket.on('response', (data) => {
      if(!data) return;
      return dispatch({
        type: data.res,
        payload: data.payload
      })
    })

    return () => {
      console.log("leaving game!");
      socket.off('response');
    }
  }, [socket])

  const requestPlayers = () => {
    return;
  }

  const requestConfig = () => {
    socket.emit('request', ({event: e.CLIENT_REQUEST.ROOM_CONFIG}));
  }

  const makeMove = (move) => {
    socket.emit('game', ({event: e.CLIENT_GAME.MOVE_PIECE, data: move}))
  }

  const onLeave = () => {
    if(!socket) return;
    socket.emit('message', ({event: e.CLIENT_ROOM.LEAVE}))
    return dispatch({
      type: "RESET",
      payload: null
    })
  }

  return (
    <GameContext.Provider value={{
      config: state.config,
      moveHistory: state.moveHistory,
      hasGameEnded: state.hasGameEnded,
      hasGameStarted: state.hasGameStarted,
      fen: state.fen,
      turnColor: state.turnColor,
      playerWhite: state.playerWhite,
      playerBlack: state.playerBlack,
      requestConfig,
      requestPlayers,
      makeMove,
      onLeave
      }}>
      {children}
    </GameContext.Provider>
  )
}
