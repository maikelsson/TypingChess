import React from 'react'

export default function Header(props) {
	return (
		<h1 style={{
			textAlign: "center"
		}}>
			{props.title}
		</h1>
	)
}
