const server = require('./server');
const connectDB = require('./db/db');

connectDB();

const gameServer = new server.default();
gameServer.listen()
