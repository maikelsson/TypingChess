const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		});

		console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline.bold)
		
	} catch (err) {
		console.log(`Error: ${err.message}`.red);
		process.env(1);
	}
}

module.exports = connectDB;