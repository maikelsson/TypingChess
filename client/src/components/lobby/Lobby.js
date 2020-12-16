import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Chessground from 'react-chessground';

import MainContainer from '../containers/MainContainer';
import RoomList from './RoomList';

import './lobby.scss';

import { LobbyContext } from './context/LobbyProvider';

export default function Lobby() {

  const { getGames, joinGame, createGame } = useContext(LobbyContext);
	const history = useHistory();
	const [activeTab, setActiveTab] = useState('newgame');

	function handleJoinGame(e, id) {
    e.preventDefault();
    joinGame(id);
		history.push("/play");
	}

	function handleTabClick(e) {
		e.preventDefault();
		setActiveTab(e.target.name);
	}

	function handleCreateRoom(e, type, seconds, increment) {
		e.preventDefault();
		
		let timeModel = {
			type: type,
			seconds: seconds,
			increment: increment
		};

    createGame(timeModel);
    
	} 

	return (
        <>
          <MainContainer>
              <div className="board-container">
                <div className="content">
                  <Chessground resizeble={true} viewOnly={true} orientation="white"/>
                </div>
              </div>
              <div className="side-panel">
                <div className="tab">
                  <button name="newgame" className={activeTab === 'newgame' ? 'active' : ''} onClick={handleTabClick}>New Game</button>
                  <button name="rooms" className={activeTab === 'rooms' ? 'active' : ''} onClick={handleTabClick}>Rooms</button>
                  <button name="players" className={activeTab === 'players' ? 'active' : ''} onClick={handleTabClick}>Players</button>
                </div>

                <div name="newgame" className={activeTab === 'newgame' ? 'tab-content-active' : 'tab-content-disabled'}>
                  <h2>Play Chess</h2>
                  <div className="button-container">
                    <button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Blitz', 180, 2)}>Blitz <span>(3 + 2)</span></button>
                    <button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Rapid', 600, 0)}>Rapid <span>(10 + 0)</span></button>
                    <button className="create-new-btn" onClick={(e) => handleCreateRoom(e, 'Classic', 900, 15)}>Classic<span>(15+15)</span></button>
                  </div>
                </div>

                <div name="rooms" className={activeTab === 'rooms' ? 'tab-content-active' : 'tab-content-disabled'}>
                  {activeTab === 'rooms' ? getGames() : null}
                  <h2>Rooms</h2>
                  <RoomList handleJoin={handleJoinGame}></RoomList>
                </div>
                <div name="players" className={activeTab === 'players' ? 'tab-content-active' : 'tab-content-disabled'}>
                  <h2>Players</h2>
                </div>
              </div>
          </MainContainer>
    
      </>
	)
}

