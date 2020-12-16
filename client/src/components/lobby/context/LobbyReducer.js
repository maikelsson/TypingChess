import { SERVER_ROOM_SUCCESS, SERVER_ROOM_ERROR, SERVER_REQUEST_SUCCESS, SERVER_REQUEST_ERROR } from '../../../constants/events/server';


// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch(action.type) {
    case SERVER_REQUEST_SUCCESS.CLIENT_REQUEST_ROOMS:
      return {
        ...state,
        games: action.payload,
        isLoading: false
      }
    case SERVER_REQUEST_ERROR.CLIENT_REQUEST_ROOMS:
      return {
        ...state,
        error: 'Problem receiving rooms'
      }
    case SERVER_ROOM_SUCCESS.CLIENT_CREATE_ROOM:
      return {
        ...state,
        currentGame: action.payload
      }
    default:
      return state;
  }
}