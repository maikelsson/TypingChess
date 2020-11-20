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

http.listen(PORT, () => 
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

io.on('connection', (socket) => {
	console.log(`new connection: ${socket}`);
	socket.join();

	socket.on('connect', () => {
		io.in().emit("hello");
		console.log("connection!!!!!!!!!!");
	})

	socket.on("newUserConnection", (data) => {
		io.in().emit("newUserConnection", data);
	});

	socket.on("disconnect", () => {
		socket.leave();
	});
})

