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
let availableGameRooms = [
	{
		name: "matchmaking",
		gameRoomUsers: [],
		canJoin: true
	},
	{
		name: "room_1",
		gameRoomUsers: [],
		opponent: "",
		canJoin: () => gameRoomUsers.length > 1 ? false : true
	},
	{
		name: "room_2",
		gameRoomUsers: [],
		opponent: "",
		canJoin: () => gameRoomUsers.length > 1 ? false : false
	}
];

let getConnectionsInterval;

http.listen(PORT, () => 
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

io.on('connection', (socket) => {

	let currentUser = {
		username: "",
		searchingForMatch: false,
		currentRoom: ""
	}

	if(getConnectionsInterval) clearInterval(getConnectionsInterval);
	getConnectionsInterval = setInterval(() => getConnectedUsersAndEmit(io, currentUser), 3000);

	socket.on('ADD_NEW_CONNECTION', (username) => {
		if(currentUser.searchingForMatch) return;
		
		currentUser.username = username;
		currentUser.searchingForMatch = true;
		connectedUsers.push(currentUser);
		currentUser.currentRoom = availableGameRooms[0].name;
		availableGameRooms[0].gameRoomUsers.push(currentUser.username);
		socket.join(currentUser.currentRoom);
		console.log(currentUser);
	})

	socket.on('TRY_JOIN_AVAILABLE_ROOM', (username) => {
		if(!currentUser.searchingForMatch) return;
		try {
			let room = availableGameRooms.find((r) => r.gameRoomUsers.length < 2 && r.name !== 'matchmaking');
			room.gameRoomUsers.push(currentUser.username);
			console.log("try join", room);
			currentUser.currentRoom = room.name;
			currentUser.searchingForMatch = false;
			socket.join(currentUser.currentRoom);
		} catch (error) {
			console.log(error);
		}
	})

	socket.on("disconnect", () => {
		console.log("disconnect!")
		connectedUsers = connectedUsers.filter((u) => u.username !== currentUser.username);
		//find the room where user is

		let room = availableGameRooms.find((r) => r.name === currentUser.currentRoom);
		room.gameRoomUsers.filter((u) => u.username !== currentUser.username);
		console.log(room.gameRoomUsers, "room");
		console.log("user rooms", currentUser.currentRoom);
		socket.leave();
	});
})

const getConnectedUsersAndEmit = (io, user) => {
	if(connectedUsers.length === 0) return;
	console.log(`${user.username} is in the room ${user.currentRoom}`);
	let room = availableGameRooms.find((r) => r.name === user.currentRoom);
	console.log("roomGet", room);
	//console.log("emitting");
	io.in(user.currentRoom).emit('GET_CONNECTIONS', room);
}


