import React from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { LoginView } from './views/LoginView';
import { RegisterView} from './views/RegisterView';
import { HomeView } from './views/HomeView';

import { GlobalProvider }from './context/GlobalState';

import './App.css';

function App() {
  	return (
		<GlobalProvider>
			<Router>
				<Switch>
					<Route path="/login">
						<LoginView />
					</Route>
					<Route path="/register">
						<RegisterView />
					</Route>
					<Route path="/home">
						<HomeView />
					</Route>
					<Route path="/">
						<LoginView />
					</Route>

				</Switch>
			</Router>
		</GlobalProvider>
  );
}

export default App;
