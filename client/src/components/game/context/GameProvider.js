import React, { createContext, useReducer, useEffect, useContext } from 'react'
import { useSocket } from '../../../context/socket/SocketProvider';

import GameReducer from './GameReducer';
import * as e from '../../../constants/events/client';

const gameState = {
  config: null, // playerNames, timecontrol etc...
  status: null, // contains board fen, history, turncolor, gamestate
  players: {
    myPlayer: null,
    opponent: null
  }
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

    socket.on('players', (data) => {
      console.log("socket on players");
      if(!data) return;
      return dispatch({
        type: data.res,
        payload: {
          players: data.payload,
          id: socket.id
        }
      })
    })

    socket.on('game', (data) => {
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

  const requestGameStatus = () => {
    socket.emit('game', ({event: "CLIENT_REQ_GAME_STATUS"}));
  }

  const requestPlayers = () => {
    socket.emit('game', ({event: e.CLIENT_REQUEST.ROOM_PLAYERS}));
  }

  const requestConfig = () => {
    socket.emit('game', ({event: e.CLIENT_REQUEST.ROOM_CONFIG}));
  }

  const makeMove = (move) => {
    socket.emit('game', ({event: e.CLIENT_GAME.MOVE_PIECE, move: move}))
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
      status: state.status,
      players: state.players,
      requestConfig,
      requestPlayers,
      requestGameStatus,
      makeMove,
      onLeave
      }}>
      {children}
    </GameContext.Provider>
  )
}
