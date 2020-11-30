const colors = require("colors");

const messageLogger = (from, message, variant) => {
	let m = getBase(from);

	switch(variant.toUpperCase()){
		case "SUCCESS":
			console.log(m + message.green)
			break; 
		case "DANGER":
			console.log(m + message.red)
			break;
		case "WARNING":
			console.log(m + message.yellow)
			break;
		case "INFO":
			console.log(m + message.yellow)  
		default:
			return "";
	}
}

function getBase(from) {
	switch(from.toUpperCase()) {
		case "SERVER":
			return `[${from.toUpperCase()}] `.yellow;
		case "EVENT":
			return `[${from.toUpperCase()}] `.cyan;
		case "CLIENT":
			return `[${from.toUpperCase()}] `.blue;
		default:
			return `[${from.toUpperCase()}] `.cyan;
	}
}

function sum(a, b) {
	return a + b;
}

module.exports = {messageLogger: messageLogger, sum: sum};