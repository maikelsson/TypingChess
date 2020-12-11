import React from 'react'

export default function MoveHistoryPanel(props) {
	return (
		<div className="history-panel">
			<h4>History:</h4>
				<ol>
					{props.moves.map((m, i) => 
					(
						<>
							{i % 2 === 0 ? <li className="index">{i === 0 ? i + 1 : i / 2 + 1}.</li> : null}
							<li key={i}>{m}</li>
						</>
					))}
				</ol>
		</div>
	)
}
