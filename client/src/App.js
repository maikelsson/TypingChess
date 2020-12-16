import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from './components/shared/PrivateRoute';  
import { AuthProvider } from './context/authentication/AuthState';

import { SocketProvider } from './context/socket/SocketProvider';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Lobby from './components/lobby/Lobby';
import Game from './components/game/Game';

function App() {
  	return (
			<>
				<Router>
					<AuthProvider>
						<Switch>
							<Route path="/login" component={Login} />
							<Route path="/register" component={Register} />
							<SocketProvider>
								<PrivateRoute path="/home" component={Home} /> 
								<PrivateRoute exact path="/" component={Home} />
								<PrivateRoute path="/lobby" component={Lobby}/>
								<PrivateRoute exact path="/play" component={Game} />
							</SocketProvider>
							<Route path="/" component={Home} />
						</Switch>
					</AuthProvider>
				</Router>		
			</>
  );
}

export default App;
