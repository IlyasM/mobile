//@flow
import type { Action } from "../actions/types"
import type { User, Message, Entry } from "../dataTypes"

type State = {
  myChats: { [key: number]: Entry },
  users: Array<User>,
  socket: ?Object,
  channel: ?Object,
  usersOnline: Array<User>,
  loading: boolean
}
const init: State = {
  myChats: [],
  users: [],
  usersOnline: [],
  socket: null,
  channel: null,
  loading: false
}

export default (state: State = init, action: Action): State => {
  switch (action.type) {
    case "CONNECT_OK":
      return { ...state, socket: action.payload.socket }
    case "JOIN_MAIN_OK":
      const { channel, users } = action.payload
      return { ...state, channel, users }
    case "MY_CHATS":
      return { ...state, myChats: action.payload.list }
    case "PRESENCE_STATE":
      return { ...state, usersOnline: action.payload.users }
    case "GET_MESSAGE":
      const { message } = action.payload
      const entry = state.myChats[message.chat_id]
      const newEntry = { ...entry, message }
      const myChats = { ...state.myChats, [entry.chatID]: newEntry }
      return {
        ...state,
        myChats
      }
    default:
      return state
  }
}
