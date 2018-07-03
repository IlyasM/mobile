//@flow
import {
  switchMap,
  mergeMap,
  catchError,
  map,
  withLatestFrom,
  debounceTime
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
  joinMain: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("JOIN_MAIN"),
      mergeMap(({ params: { user_id, socket } }) =>
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
              channel.push("received", { message })
            }
          })

          channel.on("typing", payload => {
            //if it is not me who is typing
            if (!(user_id === payload.user_id)) {
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
