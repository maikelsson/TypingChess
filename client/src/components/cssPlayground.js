import React from 'react'
import Chessboard from 'chessboardjsx';
import "./styles/navbar.css";

export default function cssPlayground() {
	return (
		<>
			
			<div style={{
				minHeight: '50vh',
				display: 'flex',
				border: '2px',
				borderRadius: '5px',
				borderColor: 'green',
				borderStyle: 'solid',
				marginLeft: '0px',
				paddingTop: '5em',
				justifyContent: 'space-evenly'
			}}>
				<Chessboard showNotation={false}/>
				<div style={{
					border: '2px',
					borderColor: 'blue',
					borderStyle: 'solid',
					borderRadius: '7px',
					minWidth: '40vh',
					padding: '5vh',
					display: 'flex-inline',
					backgroundColor: '#31363F'
				}}>
					<div className="playerBox">
						aas
						<p>a</p>
					</div>
					<div>
						asdads
					</div>
				</div>
			</div>
			<div style={{
				border: '2px',
				borderColor: 'green',
				borderStyle: 'solid',
				lineHeight: 0.5,
				paddingTop: '0.5em',
				display: 'flex'
			}}>
				<p style={{
					justifyContent: 'end',
					display: 'flex'
				}}>player 1 FIN</p>
				<p>1500</p>
				<div style={{
					justifyContent: "end"
				}}>
					kaka
				</div>
			</div>
			<div className="dropdown">
				<span className="dropdown-title">Hover</span>
				<p className="dropdown-content">Content</p>
			</div>
		</>
	)
}

const layout = {
	minHeight: '50vh',
	display: 'flex',
	border: '2px',
	borderColor: 'green'
}

const infoBox = {
	backgroundColor: 'red'
}

