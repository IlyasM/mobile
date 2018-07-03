//@flow
import type { Action } from "../actions/types"
import type { User, Message } from "../dataTypes"
import values from "lodash/values"
type State = {
  chats: {
    [chatID: number]: { messages: Array<Message>, last_seen_id: number }
  },
  typing: boolean
}
const init: State = {
  chats: {},
  typing: false
}

export default (state: State = init, action: Action): State => {
  let entry
  switch (action.type) {
    case "JOIN_CONVERSATION_OK":
      const { chatID, messages } = action.payload
      let new_State,
        chat = state.chats[chatID],
        last_seen_id = chat ? chat.last_seen_id : 0
      if (chat && messages.length < 1) {
        return state
      }
      if (messages.length > 0) {
        last_seen_id = messages[messages.length - 1].id
      }

      if (!chat) {
        new_state = {
          ...state,
          chats: {
            ...state.chats,
            [chatID]: { messages: messages.reverse(), last_seen_id }
          }
        }
      } else {
        new_state = {
          ...state,
          chats: {
            ...state.chats,
            [chatID]: {
              messages: [...messages.reverse(), ...chat.messages],
              last_seen_id
            }
          }
        }
      }
      return new_state

    case "GET_MESSAGE":
      const { message } = action.payload
      entry = state.chats[message.chat_id]
      return {
        ...state,
        chats: {
          [message.chat_id]: {
            ...entry,
            messages: [message, ...entry.messages],
            last_seen_id: message.id
          }
        }
      }
    case "MARK_RECEIVED":
      return state
    case "TYPING_INCOMING":
      return { ...state, typing: true }
    case "TYPING_INCOMING_STOP":
      return { ...state, typing: false }

    default:
      return state
  }
}
