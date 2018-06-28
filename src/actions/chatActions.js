//@flow
import {
  mergeMap,
  catchError,
  map,
  withLatestFrom,
  ignoreElements,
  tap
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
  typing: (chat_id: number, channel: Object) => ({
    type: "TYPING",
    params: {
      chat_id,
      channel
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
            home: { socket }
          }
        ]) =>
          Obs.create(observer => {
            const channel = socket.channel(`conversation:${chat_id}`)
            channel
              .join()
              .receive("ok", response => {
                observer.next({
                  type: "JOIN_CONVERSATION_OK",
                  payload: { channel, messages: response.messages }
                })
              })
              .receive("error", error =>
                observer.next({ type: "JOIN_CONVERSATION_ERROR", error })
              )

            channel.on("new:msg", ({ message }) => {
              observer.next({ type: "GET_MESSAGE", payload: { message } })
              observer.next(chatActions.pushStatus(message.id, channel, "seen"))
            })
            channel.on("received", ({ message }) => {
              observer.next({ type: "MARK_RECEIVED", payload: { message } })
            })
            channel.on("seen", ({ message }) => {
              observer.next({ type: "MARK_SEEN", payload: { message } })
            })
            channel.on("typing", ({ chat_id }) => {
              observer.next({ type: "TYPING", payload: { chat_id } })
            })
          })
      )
    ),
  typing: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("TYPING"),
      tap(({ params: { chat_id, channel } }) =>
        channel.push("typing", { chat_id })
      ),
      ignoreElements()
    ),
  newMessage: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("NEW_MESSAGE"),
      mergeMap(({ params: { channel, chat_id, author_id, text } }) =>
        Obs.create(observer => {
          channel
            .push("new:msg", { message: { chat_id, author_id, text } })
            .receive("ok", message => {
              observer.next({ type: "GET_MESSAGE", payload: { message } })
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
