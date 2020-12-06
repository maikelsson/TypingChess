import React from 'react';
import SideNavBar from '../SideNavBar';

export default function MainContainer({children}) {
	return (
		<div className="main-container">
			<div className="sidenav-container">
				<SideNavBar />
			</div>
			<div className="content-container">
				{children}
			</div>
		</div>
	)
}
