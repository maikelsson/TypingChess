const RoomManager = require('../managers/room.js');
const RoomManagerConsumer = require('../managers/consumers/room-consumer.js');
const { OperationCanceledException } = require('typescript');
jest.mock('../managers/room.js');

beforeEach(() => {
	RoomManager.mockClear();
});

it('The consumer should be able to call new() on SoundPlayer', () => {
  const roomManagerConsumer = new RoomManagerConsumer();
  // Ensure constructor created the object:
  expect(roomManagerConsumer).toBeTruthy();
});

it('We can check if the consumer called the class constructor', () => {
  const roomManagerConsumer = new RoomManagerConsumer();
  expect(RoomManager).toHaveBeenCalledTimes(1);
});

it('We can check if the consumer called a method on the class instance', () => {
	// checking that the mockClear() is working
	expect(RoomManager).not.toHaveBeenCalled();

	const roomManagerConsumer = new RoomManagerConsumer();
	// should have been called again:
	expect(RoomManager).toHaveBeenCalledTimes(1);

	let room = null;

	roomManagerConsumer.consumerAddRoom(room);
	
	const mockRoomManagerInstance = RoomManager.mock.instances[0];
	const mockAddUserToRoom = mockRoomManagerInstance.addRoom;
	expect(mockAddUserToRoom.mock.calls[0][0]).toEqual();
	
})