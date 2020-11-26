const colors = require("colors");

const messageLogger = (from, message, variant) => {
	let m = getBase(from);

	switch(variant){
		case "SUCCESS":
			console.log(m + message.green)
			break; 
		case "DANGER":
			console.log(m + message.red)
			break;
		case "WARNING":
			console.log(m + message.yellow)
			break;  
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
			return `[${from.toUpperCase()}] `.white;
	}
}

module.exports = messageLogger