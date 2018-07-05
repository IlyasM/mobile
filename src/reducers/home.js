//@flow
import type { Action } from "../actions/types"
import type { User, Message } from "../dataTypes"
import values from "lodash/values"
import Faker from "faker"
type State = {
  myChats: {
    [chatID: number]: {
      user: User,
      chatID: number,
      message: Message,
      typing: boolean
    }
  },
  users: { [userID: number]: User },
  dataSource: Array<Object>
}
const init: State = {
  users: {},
  myChats: {},
  dataSource: []
}

export default (state: State = init, action: Action): State => {
  let myChats, dataSource
  switch (action.type) {
    case "JOIN_MAIN_OK":
      let { users } = action.payload
      return { ...state, users }
    case "MY_CHATS":
      myChats = action.payload.list.reduce(
        (acc, { u_id, chat_id, message, unseen_count }) => ({
          ...acc,
          [chat_id]: {
            user: state.users[u_id],
            chatID: chat_id,
            unseenCount: unseen_count,
            message,
            typing: false
          }
        }),
        {}
      )
      dataSource = sortChatsByLastMessage(myChats)
      return { ...state, myChats, dataSource }
    case "GET_MESSAGE":
      const { message } = action.payload
      const entry = state.myChats[message.chat_id]
      myChats = {
        ...state.myChats,
        [entry.chatID]: {
          ...entry,
          message,
          unseenCount: entry.unseenCount + 1,
          typing: false
        }
      }
      dataSource = sortChatsByLastMessage(myChats)
      return { ...state, myChats, dataSource }
    case "TYPING_INCOMING":
      return handleTyping(true, action.payload.chatID, state)
    case "TYPING_INCOMING_STOP":
      return handleTyping(false, action.payload.chatID, state)
    default:
      return state
  }
}

const sortChatsByLastMessage = chats =>
  values(chats).sort((a, b) => a.message.id < b.message.id)
const handleTyping = (flag: boolean, chatID: string, state: State): State => {
  const dataSource = state.dataSource.map(entry => {
    if (`${entry.chatID}` === chatID) {
      return { ...entry, typing: flag }
    }
    return entry
  })
  return {
    ...state,
    dataSource
  }
}
