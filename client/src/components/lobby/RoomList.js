import React from 'react'

import { LobbyContext } from './context/LobbyProvider';

export default function RoomList({rooms, handleJoin}) {

  const { games } = React.useContext(LobbyContext);

	return (
		<div className="room-list">
			{games ? 
			<>
				<ul className="header">
					<li key="rooms">
						<p>name</p>
						<p>time</p>
						<p>type</p>
						<p>action</p>
					</li>
				</ul>
				<ul style={{
				height: '380px',
				overflow: "hidden",
				overflowY: "scroll"}}>
					{games.map((g) => (
						<>
							{g
							?	<li key={g.id}>
									<p>{g.name}</p>
									<p>{g.time}</p>
									<p>{g.type}</p>
									<button onClick={(e) => handleJoin(e, g.id)}>Join</button>					
								</li> 
							: <p>No rooms available..</p>}
						</>))}
					</ul>
				</> 
				: <p>Loading...</p>}
			</div>
	)
}
