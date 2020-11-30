import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from './components/PrivateRoute';  
import { GlobalProvider } from './context/GlobalState';
import { AuthProvider } from './context/authentication/AuthState';

import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.scss';

import { SocketProvider } from './context/socket/SocketProvider';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Game from './components/Game';

function App() {
  	return (
			<Container className="d-flex align-items-center justify-content-center" style={{
				minHeight: "60vh",
				padding: "0em"
			}}>
				<div className="w-100" style={{ minWidth: "10em"}}>
					<Router>
						<AuthProvider>
							<Switch>
								<Route path="/login" component={Login} />
								<Route path="/register" component={Register} /> 
								<SocketProvider>
									<PrivateRoute exact path='/' component={Home} />
									<PrivateRoute path='/game' component={Game} />
								</SocketProvider>
							</Switch>
						</AuthProvider>
					</Router>
				</div>
			</Container>
  );
}

export default App;
