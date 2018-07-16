//@flow
import type { Action } from "../actions/types"
import type { User, Message } from "../dataTypes"
import values from "lodash/values"

type State = {
  chats: {
    [chatID: number]: {
      messages: Array<Message>,
      last_seen_id: number,
      typing: boolean
    }
  }
}
const init: State = {
  chats: {}
}

export default (state: State = init, action: Action): State => {
  let entry, chatID, messages, message
  switch (action.type) {
    case "JOIN_CONVERSATION_OK":
      chatID = action.payload.chatID
      messages = action.payload.messages
      let chat = state.chats[chatID],
        last_seen_id = chat ? chat.last_seen_id : 0
      if (chat && messages.length < 1) {
        return state
      }
      if (messages.length > 0) {
        last_seen_id = messages[messages.length - 1].id
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatID]: {
            messages: !chat
              ? messages.reverse
              : [...messages.reverse(), ...chat.messages],
            last_seen_id,
            typing: false
          }
        }
      }

    case "GET_MESSAGE":
      message = action.payload.message
      entry = state.chats[message.chat_id]
      if (!entry) return state
      return {
        ...state,
        chats: {
          ...state.chats,
          [message.chat_id]: {
            ...entry,
            messages: [message, ...entry.messages],
            last_seen_id: message.id
          }
        }
      }
    case "MARK_RECEIVED":
    case "MARK_SEEN":
      return handleStatusUpdate(action.payload.message, state)
    case "MARK_SEEN_ENTER":
      message = action.payload.message
      entry = state.chats[message.chat_id]
      if (!entry) {
        return state
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [message.chat_id]: {
            ...entry,
            messages: entry.messages.map(m => ({ ...m, status: "seen" }))
          }
        }
      }
    case "TYPING_INCOMING":
      return handleTyping(true, action.payload.chatID, state)
    case "TYPING_INCOMING_STOP":
      return handleTyping(false, action.payload.chatID, state)
    default:
      return state
  }
}
const handleStatusUpdate = (message: Message, state: State): State => {
  const entry = state.chats[message.chat_id]
  return {
    ...state,
    chats: {
      ...state.chats,
      [message.chat_id]: {
        ...entry,
        messages: entry.messages.map(m => (m.id === message.id ? message : m))
      }
    }
  }
}
const handleTyping = (typing: boolean, chatID: number, state: State): State => {
  const chat = state.chats[chatID]
  if (!chat) return state
  return {
    ...state,
    chats: { ...state.chats, [chatID]: { ...chat, typing } }
  }
}
