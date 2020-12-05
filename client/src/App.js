import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from './components/PrivateRoute';  
import { GlobalProvider } from './context/GlobalState';
import { AuthProvider } from './context/authentication/AuthState';

import { SocketProvider } from './context/socket/SocketProvider';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Lobby from './components/Lobby';
import newHome from './components/newHome';
import Game from './components/Game';

function App() {
  	return (
			<>
				<Router>
					<AuthProvider>
						<Switch>
							<Route path="/login" component={Login} />
							<Route path="/register" component={Register} /> 
							<Route path="/home" component={newHome} /> 
							<Route path="/lobby" component={Lobby} />
							<Route exact path="/play" component={Game} />
							<PrivateRoute path="/" component={Home} />
						<SocketProvider>
							<PrivateRoute exact path='/' component={Home} />
						</SocketProvider>
						</Switch>
					</AuthProvider>
				</Router>		
			</>
  );
}

export default App;
