//@flow
import type { Action } from "../actions/types"

type State = {
  socket: ?Object,
  currentChannel: ?Object
}
const init: State = {
  socket: null,
  currentChannel: null
}

export default (state: State = init, action: Action): State => {
  switch (action.type) {
    case "CONNECT_OK":
      return { ...state, socket: action.payload.socket }
    case "JOIN_CONVERSATION_OK":
    case "JOIN_MAIN_OK":
      return { ...state, currentChannel: action.payload.channel }
    default:
      return state
  }
}
