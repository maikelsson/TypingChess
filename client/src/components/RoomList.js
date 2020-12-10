import React from 'react'

export default function RoomList({rooms, handleJoin}) {
	return (
		<div className="room-list">
			{rooms ? 
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
					{rooms.map((r) => (
						<>
							{r
							?	<li key={r.id}>
									<p>{r.name}</p>
									<p>{r.time}</p>
									<p>{r.type}</p>
									<button onClick={(e) => handleJoin(e, r.id)}>Join</button>					
								</li> 
							: <p>No rooms available..</p>}
						</>))}
					</ul>
				</> 
				: <p>Loading...</p>}
			</div>
	)
}
