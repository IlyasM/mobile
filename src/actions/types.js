//@flow
import type { Message, Event, User } from "../dataTypes"

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
      error: { email: Array<string> }
    }
  | { type: "LOGIN", params: { email: string, password: string } }
  | {
      type: "LOGIN_OK",
      payload: { user: User, token: string }
    }
  | { type: "LOGIN_ERROR", error: string }
  | { type: "LOGOUT" }
  | { type: "CONNECT" }
  | { type: "CONNECT_OK", payload: { socket: Object } }
  | { type: "CONNECT_ERROR", error: string }
  | { type: "JOIN_MAIN", params: { user_id: number, socket: Object } }
  | {
      type: "JOIN_MAIN_OK",
      payload: { channel: Object, users: { [userID: number]: User } }
    }
  | { type: "JOIN_MAIN_ERROR", error: string }
  | { type: "PRESENCE_STATE", payload: { users: Array<User> } }
  | {
      type: "MY_CHATS",
      payload: {
        list: Array<{ u_id: number, chat_id: number, message: Message }>
      }
    }
  | { type: "NEW_CHAT", params: { user_id: number } }
  | { type: "NEW_CHAT_OK", payload: { u_id: number, chat_id: number } }
  | {
      type: "JOIN_CONVERSATION",
      params: { chat_id: number, last_seen_id: number }
    }
  | {
      type: "JOIN_CONVERSATION_OK",
      payload: { messages: Array<Message>, channel: Object }
    }
  | { type: "GET_MESSAGE", payload: { message: Message } }
  | { type: "MARK_RECEIVED", payload: { message: Message } }
  | { type: "MARK_SEEN", payload: { message: Message } }
