
class MessageManager {
  constructor(io) {
    this.io = io;
  }

  sendMessageToRoom(roomId, data, event, response = "response") {
    this.io.in(roomId).emit(response, ({res: event, payload: data}))
  }

  sendMessageToSocket(socket, data, response) {
    socket.emit("response", ({payload: data, res: response}))
  }

}

module.exports = MessageManager;