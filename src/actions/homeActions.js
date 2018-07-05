//@flow
import {
  switchMap,
  mergeMap,
  catchError,
  map,
  withLatestFrom,
  tap,
  debounceTime,
  ignoreElements
} from "rxjs/operators"
import { Observable as Obs, of } from "rxjs"
import { ofType } from "redux-observable"
import type { Action } from "./types"
import { Socket } from "phoenix"
import { baseURL, headers, wsURL } from "../constants/networking"
import type { Observable } from "rxjs"
import type { Event } from "../dataTypes"
export const homeActions: { [key: string]: (...args: any) => Action } = {
  connect: (token: string) => ({
    type: "CONNECT"
  }),
  newChat: (user_id: number) => ({
    type: "NEW_CHAT",
    params: { user_id }
  }),
  joinMain: (user_id: number, socket: Object) => ({
    type: "JOIN_MAIN",
    params: { user_id, socket }
  })
}
export default {
  connect: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("CONNECT"),
      withLatestFrom(state$),
      mergeMap(
        ([
          action,
          {
            auth: {
              token,
              user: { id }
            },
            socket: { socket }
          }
        ]) =>
          Obs.create(observer => {
            let sock
            if (!socket) {
              sock = new Socket(`${wsURL}/socket`, {
                params: { token }
              })
              sock.connect()
              sock.onError(e =>
                observer.next({ type: "CONNECT_ERROR", error: "unauthorized" })
              )
              observer.next({ type: "CONNECT_OK", payload: { socket: sock } })
            }
            observer.next(homeActions.joinMain(id, socket ? socket : sock))
          })
      )
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
    ),
  joinMain: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("JOIN_MAIN"),
      withLatestFrom(state$),
      mergeMap(
        ([
          {
            params: { user_id, socket }
          },
          {
            socket: { currentChannel }
          }
        ]) =>
          Obs.create(observer => {
            const channel = socket.channel(`main:${user_id}`)
            channel
              .join()
              .receive("ok", response => {
                observer.next({
                  type: "JOIN_MAIN_OK",
                  payload: { channel, users: response.users }
                })
              })
              .receive("error", error =>
                observer.next({ type: "JOIN_MAIN_ERROR", error })
              )
            channel.on("my_chats", payload =>
              observer.next({
                type: "MY_CHATS",
                payload: { list: payload.state }
              })
            )
            channel.on("new:msg", message => {
              if (message.author_id !== user_id) {
                observer.next({ type: "GET_MESSAGE", payload: { message } })
              }
            })
            channel.on("received", message => {
              observer.next({ type: "MARK_RECEIVED", payload: { message } })
            })
            channel.on("seen", message => {
              if (message.on_enter && message.author_id !== user_id) {
                observer.next({ type: "MARK_SEEN_ENTER", payload: { message } })
              }
              if (!message.on_enter && message.author_id === user_id) {
                observer.next({ type: "MARK_SEEN", payload: { message } })
              }
            })
            channel.on("typing", payload => {
              if (user_id !== payload.user_id) {
                observer.next({
                  type: "TYPING_INCOMING",
                  payload: { chatID: payload.chat_id }
                })
              }
            })
          })
      )
    )
}
