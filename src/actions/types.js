//@flow
import type { Message, Event, User, Entry } from "../dataTypes"

export type Action =
  | {
      type: "SIGN_UP",
      params: { name: string, email: string, password: string }
    }
  | {
      type: "SIGN_UP_OK",
      payload: { ok: string }
    }
  | {
      type: "SIGN_UP_ERROR",
      error: Array<Object>
    }
  | { type: "LOGIN", params: { email: string, password: string } }
  | {
      type: "LOGIN_OK",
      payload: { user: User, token: string }
    }
  | { type: "LOGIN_ERROR", error: string }
  | { type: "LOGOUT" }
  | { type: "CONNECT", params: { token: string } }
  | { type: "CONNECT_OK", payload: { socket: Object } }
  | { type: "CONNECT_ERROR", error: string }
  | { type: "JOIN_MAIN", params: { user_id: number, socket: Object } }
  | { type: "JOIN_MAIN_OK", payload: { channel: Object, users: Array<User> } }
  | { type: "JOIN_MAIN_ERROR", error: string }
  | { type: "PRESENCE_STATE", payload: { users: Array<User> } }
  | {
      type: "MY_CHATS",
      payload: { list: Array<Entry> }
    }
  | { type: "NEW_CHAT", params: { user_id: number } }
  | { type: "NEW_CHAT_OK", payload: { entry: Entry } }
  | {
      type: "JOIN_CONVERSATION",
      params: { chat_id: number, last_seen_id: number }
    }
  | { type: "JOIN_CONVERSATION_OK", payload: { messages: Array<Message> } }
  | { type: "GET_MESSAGE", payload: { message: Message } }
  | { type: "OBSERVE_EVENT", payload: { event: Event } }
