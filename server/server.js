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

	//if(getConnectionsInterval) clearInterval(getConnectionsInterval);
	//getConnectionsInterval = setInterval(() => getConnectedUsersAndEmit(io, currentUser), 3000);

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

	socket.on('GET_ROOMS', () => {
		console.log("get rooms server")
		io.in(currentUser.currentRoom).emit('GET_ROOMS', availableGameRooms)
	})

	socket.on("client_join_room", (roomName) => {
		try {

			// removing user from oldroom
			var filtered = availableGameRooms.map(function(r) {
				r.gameRoomUsers = r.gameRoomUsers.filter(function(u) {return u !== currentUser.username;});
				return r;
			});

			availableGameRooms = filtered;
			socket.leave(currentUser.currentRoom);

			let roomToJoin = availableGameRooms.find((r) => r.name === roomName);
			roomToJoin = roomToJoin.gameRoomUsers.push(currentUser.username);
			socket.join(roomName);
			currentUser.currentRoom = roomName;
		} catch (error) {
			console.log("error: ", error);
		}
	})

	socket.on('GET_ROOM_DETAILS', () => {
		io.in(currentUser.currentRoom).emit('GET_ROOM_DETAILS', ({roomName: currentUser.currentRoom, users: availableGameRooms.find((r) => r.name === currentUser.currentRoom)}));
	})

	socket.on("disconnect", () => {
		console.log("disconnect!")
		connectedUsers = connectedUsers.filter((u) => u.username !== currentUser.username);
		console.log(connectedUsers);
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


