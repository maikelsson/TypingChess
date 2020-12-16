import React from 'react'

export default function MoveInput({handleMove, moveRef}) {
	return (
		<div style={{
			marginTop: "30px",
			display: "flex",
			alignItems: 'center',
			justifyContent: 'center',
		}}>
			<p>Type your move: </p>
			<form className="move-input" onSubmit={handleMove}>
				<input className="move-input" type="text" ref={moveRef}/>
				<input type="submit" hidden={true} onSubmit={handleMove}/>
			</form>
		</div>
	)
}
