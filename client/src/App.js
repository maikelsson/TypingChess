import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from './components/shared/PrivateRoute'; 
 
import { AuthProvider } from './context/authentication/AuthState';
import { SocketProvider } from './context/socket/SocketProvider';
import { LobbyProvider} from './components/lobby/context/LobbyProvider';
import { GameProvider} from './components/game/context/GameProvider';

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
                <LobbyProvider>
								  <PrivateRoute path="/lobby" component={Lobby}/>
                </LobbyProvider>
                <GameProvider>
								  <PrivateRoute exact path="/play" component={Game} />
                </GameProvider>
							</SocketProvider>
							<Route path="/" component={Home} />
						</Switch>
					</AuthProvider>
				</Router>		
			</>
  );
}

export default App;
