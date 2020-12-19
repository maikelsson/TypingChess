
// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch(action.type) {
    case "GAME_CONFIG_OK":
      return handleConfig(action, state);
    case "GAME_STATUS_OK":
      return {
        ...state,
        status: action.payload
      }

    case "CLIENT_JOINED_OK":
      console.log("player joined from reducer");
      return {
        ...state
      }

    case "RECEIVE_PLAYERS_OK":
      return handlePlayers(action, state);
    
    case "GAME_MOVE_OK":
      return {
        ...state,
        status: action.payload
      }

    case "GAME_MOVE_ERROR":
      return {
        ...state
      }
    
    case "CLIENT_DISCONNECT":
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

function handlePlayers(action, state) {
  
  let myId = action.payload.id;
  let white = action.payload.players.white;
  let black = action.payload.players.black;

  let myPlayer = null;
  let opp = null;

  if(myId === white.id) {
    myPlayer = white;
    opp = black
  } else {
    myPlayer = black;
    opp = white
  }

  return {
    ...state,
    players: {
      myPlayer: myPlayer,
      opponent: opp
    }
  }
}
