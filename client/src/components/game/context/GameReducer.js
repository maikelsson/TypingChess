import * as e from '../../../constants/events/server';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch(action.type) {
    case "SERVER_CONFIG":
      return handleConfig(action, state);
    case e.SERVER_ROOM_SUCCESS.CLIENT_MOVE_PIECE:
      return {
        ...state,
        fen: action.payload.fen,
        moveHistory: action.payload.history,
        turnColor: action.payload.turnColor
      }
    case "PLAYER_JOINED_GAME":
      console.log("player joined from reducer");
      return {
        ...state
      }
    case "RESET":
      console.log("reset!!!")
      return {
        ...state,
        config: action.payload
      }
    default:
      return {
        ...state
      }
  }
}

function handleConfig(action, state) {
  let oldConfig = state.config;
  if(oldConfig === action.payload) return;
  return {
    ...state,
    config: action.payload
  }
}
