//@flow
import {
  mergeMap,
  catchError,
  map,
  withLatestFrom,
  ignoreElements,
  tap,
  takeUntil,
  debounceTime
} from "rxjs/operators"
import { Observable as Obs } from "rxjs"
import { ofType } from "redux-observable"
import { Socket } from "phoenix"
import type { Observable } from "rxjs"
import type { Action } from "./types"
import type { Message } from "../dataTypes"
export const chatActions: { [key: string]: (...args: any) => Action } = {
  joinConversation: (chat_id: number, last_seen_id: number) => ({
    type: "JOIN_CONVERSATION",
    params: { chat_id, last_seen_id }
  }),
  newMessage: (text: string, author_id: number, chat_id: number) => ({
    type: "NEW_MESSAGE",
    params: { text, author_id, chat_id }
  }),
  pushTyping: (chat_id: number, channel: Object) => ({
    type: "PUSH_TYPING",
    params: {
      chat_id
    }
  }),
  pushStatus: (messageId: number, channel: Object, status: string) => ({
    type: "PUSH_STATUS",
    params: { messageId, channel, status }
  })
}

export default {
  joinConversation: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("JOIN_CONVERSATION"),
      withLatestFrom(state$),
      mergeMap(
        ([
          {
            params: { chat_id, last_seen_id }
          },
          {
            socket: { socket },
            auth: { user },
            chat: { chats }
          }
        ]) =>
          Obs.create(observer => {
            let last_seen_id = chats[chat_id] && chats[chat_id].last_seen_id
            const channel = socket.channel(`conversation:${chat_id}`, {
              last_seen_id: last_seen_id ? last_seen_id : 0
            })
            channel
              .join()
              .receive("ok", response => {
                observer.next({
                  type: "JOIN_CONVERSATION_OK",
                  payload: {
                    channel,
                    messages: response.messages,
                    chatID: chat_id
                  }
                })
              })
              .receive("error", error =>
                observer.next({ type: "JOIN_CONVERSATION_ERROR", error })
              )
          })
      )
    ),
  typing: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("PUSH_TYPING"),
      withLatestFrom(state$),
      tap(
        ([
          {
            params: { chat_id, channel }
          },
          {
            socket: { currentChannel },
            auth: { user }
          }
        ]) => currentChannel.push("typing", { chat_id, user_id: user.id })
      ),
      ignoreElements()
    ),
  newMessage: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("NEW_MESSAGE"),
      withLatestFrom(state$),
      mergeMap(
        ([
          {
            params: { chat_id, author_id, text }
          },
          {
            socket: { currentChannel }
          }
        ]) =>
          Obs.create(observer => {
            currentChannel
              .push("new:msg", { message: { chat_id, author_id, text } })
              .receive("ok", ({ message }) => {
                observer.next({
                  type: "GET_MESSAGE",
                  payload: { message: message }
                })
              })
          })
      )
    ),
  pushStatus: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("PUSH_STATUS"),
      tap(({ params: { messageId, channel, status } }) =>
        channel.push(status, { message_id: messageId })
      ),
      ignoreElements()
    )
}
