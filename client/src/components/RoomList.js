import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

export default function RoomList(props) {
	return (
		<>
			<ListGroup variant="flush">
				{props.rooms.length < 1 
				? <p>No rooms</p>
				: props.rooms.map((r) => (
					<ListGroup.Item key={r.roomId}>
						{r.roomId} {r.users.length} / 2 <span><Button onClick={(e) => props.handleJoinRoom(e, r.roomId)}>Join</Button></span>
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
}
