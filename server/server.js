const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const morgan = require('morgan');
const socketIo = require('socket.io');

const EventManager = require('./managers/eventManager');

dotenv.config({ path: './config/config.env'});
const usersRoute = require('./routes/users');

class GameServer {
	constructor() {
		this.app = express()
		this.app.use(express.json());
		this.server = http.createServer(this.app);
		this.io = socketIo(this.server);
		
		this.eventManager = new EventManager();

		this.port = process.env.PORT || 5000;

		this.registerServerRoutes();
		this.registerServerEvents();

	}

	registerServerRoutes() {
		if(process.env.NODE_ENV === 'development') {
			this.app.use(morgan('dev'));
		}

		this.app.use('/api/v1/users', usersRoute);
	}

	registerServerEvents() {
		this.io.on('connection', (socket) => {
			this.eventManager.onConnection(socket);

			socket.on('message', (data) => {
				this.eventManager.onMessage(socket, data, this.io);
			})

			socket.on('request', (data) => {
				this.eventManager.onRequest(socket, data, this.io);
			})

			socket.on('game', (data) => {
				this.eventManager.onGame(socket, data, this.io);
			})

			socket.on('disconnect', () => {
				this.eventManager.onDisconnect(socket);
			})
		})
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log(`Server running in ${process.env.NODE_ENV} mode on port ${this.port}`)
		})
	}
}

exports.default = GameServer;
