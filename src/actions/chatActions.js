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
  typing: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("PUSH_TYPING"),
      withLatestFrom(state$),
      tap(
        ([
          {
            params: { chat_id }
          },
          {
            socket: { currentChannel },
            auth: { user }
          }
        ]) => currentChannel.push("typing", { chat_id, user_id: user.id })
      ),
      ignoreElements()
    ),
  typingIncoming: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("TYPING_INCOMING"),
      debounceTime(800),
      switchMap(action => {
        return of({
          type: "TYPING_INCOMING_STOP",
          payload: { chatID: action.payload.chatID }
        })
      })
    ),
  getMessage: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("GET_MESSAGE"),
      withLatestFrom(state$),
      tap(
        ([
          {
            payload: { message }
          },
          {
            socket: { currentChannel },
            auth: { user }
          }
        ]) => {
          if (message.author_id === user.id) {
            return
          }
          if (currentChannel.topic === `conversation:${message.chat_id}`) {
            currentChannel.push("seen", { message_id: message.id })
          } else {
            currentChannel.push("received", { message })
          }
        }
      ),
      ignoreElements()
    )
}
