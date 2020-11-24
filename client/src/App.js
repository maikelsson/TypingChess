import React from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { LoginView } from './views/LoginView';
import { RegisterView} from './views/RegisterView';
import { HomeView } from './views/HomeView';
import { GameView } from './views/GameView';
import { PrivateRoute } from './components/PrivateRoute';  

import { GlobalProvider } from './context/GlobalState';
import { AuthProvider } from './context/authentication/AuthState';


import './App.css';
import { SocketProvider } from './context/socket/SocketProvider';

function App() {
  	return (
		<GlobalProvider>
			<AuthProvider>
				<SocketProvider>
					<Router>
						<Switch>
							
							<Route path="/login">
								<LoginView />
							</Route>
							<Route path="/register">
								<RegisterView />
							</Route>
								<PrivateRoute path='/game' component={GameView} />
								<PrivateRoute path='/home' component={HomeView}/>
							
							<Route path="/">
								<LoginView />
							</Route>

						</Switch>
					</Router>
				</SocketProvider>	
			</AuthProvider>
		</GlobalProvider>
  );
}

export default App;
