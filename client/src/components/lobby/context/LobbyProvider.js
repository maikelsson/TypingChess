import React, { useState, createContext, useEffect, useReducer } from 'react';
import { useSocket } from '../../../context/socket/SocketProvider';
import LobbyReducer from './LobbyReducer';

import {CLIENT_ROOM, CLIENT_REQUEST } from '../../../constants/events/client';

const lobbyState = {
  games: [],
  error: '',
  isLoading: false
}

export const LobbyContext = createContext(lobbyState);

export const LobbyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LobbyReducer, lobbyState);
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
      socket.off('response');
    }

  }, [socket])

  const getGames = () => {
    if(state.isLoading) return;
    console.log("getGames!");
    
		socket.emit('request', ({event: CLIENT_REQUEST.ROOMS}))
  }

  const joinGame = (id) => {
    console.log("joining game!", id);
    return;
  }

  const createGame = (timeModel) => {
    console.log("creating game", timeModel);
    return;
  }

  return(
    <LobbyContext.Provider value={{
      games: state.games,
      errorMessage: state.error,
      isLoading: state.isLoading,
      getGames,
      joinGame,
      createGame
    }}>
      {children}
    </LobbyContext.Provider>
  )
} 
