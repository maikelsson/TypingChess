const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./db/db');

dotenv.config({ path: './config/config.env'});

connectDB();

const users = require('./routes/users');

const app = express();
app.use(express.json());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;

let numOfUsers = 0;
let connectedUsers = [];
let gameRooms = [];
let interval;

http.listen(PORT, () => 
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

io.on('connection', async (socket) => {
	
	let currentUser = {
		username: "",
		searchingForMatch: false,
		currentRoom: ""
	}

	if(interval) clearInterval(interval);
	interval = setInterval(() => getConnectedUsersAndEmit(io), 1500);

	socket.on('ADD_NEW_CONNECTION', (username) => {
		if(currentUser.searchingForMatch) return;
		currentUser.username = username;
		++numOfUsers;
		currentUser.searchingForMatch = true;
		console.log(numOfUsers, currentUser.username);
		if(!connectedUsers.find((u) => u === currentUser.username)) {
			connectedUsers.push(currentUser);
			socket.join("matchmaking");
			currentUser.currentRoom = "matchmaking";
			console.log(connectedUsers);
		}
	})

	socket.on("newUserConnection", (data) => {
		console.log("from server, newUserConn");
		io.in().emit("newUserConnection", data);
	});

	socket.on("disconnect", () => {
		console.log("disconnect!")
		if(currentUser.searchingForMatch) {
			--numOfUsers;
			connectedUsers = connectedUsers.filter((u) => u.username !== currentUser.username);
			console.log(connectedUsers.length, connectedUsers);
		}
		socket.leave();
	});
})

const getConnectedUsersAndEmit = io => {
	if(connectedUsers.length === 0) {
		// make a new room and wait for opponent?
		return;
	} 
	console.log("emitting");
	io.in("matchmaking").emit('GET_CONNECTIONS', connectedUsers);
}

