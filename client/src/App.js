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
import cssPlayground from './components/cssPlayground';

function App() {
  	return (
			<Container fluid className="d-flex" style={{
				minHeight: "60vh",
				paddingLeft: '1em',
				marginTop: '5px'
			}}>
				<div className="w-100" style={{ minWidth: "10em"}}>
					<Router>
						<AuthProvider>
							<Switch>
								<Route path="/playground" component={cssPlayground} />
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
