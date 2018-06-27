//@flow
import { mergeMap, catchError, map, withLatestFrom } from "rxjs/operators"
import { Observable as Obs } from "rxjs"
import { ofType } from "redux-observable"
import type { Action } from "./types"
import { Socket } from "phoenix"
import { baseURL, headers, wsURL } from "../constants/networking"
import type { Observable } from "rxjs"
import type { Event } from "../dataTypes"
export const homeActions: { [key: string]: (...args: any) => Action } = {
  connect: (token: string) => ({
    type: "CONNECT",
    params: { token }
  }),
  newChat: (user_id: number) => ({
    type: "NEW_CHAT",
    params: { user_id }
  })
}
export default {
  connect: (action$: Observable<Action>, state$: Observable<any>) =>
    action$.pipe(
      ofType("CONNECT"),
      withLatestFrom(state$),
      mergeMap(([action, { auth: { user: { id } } }]) =>
        Obs.create(observer => {
          const socket = new Socket(`${wsURL}/socket`, action.params)
          socket.connect()
          socket.onError(() =>
            observer.next({ type: "CONNECT_ERROR", error: "unauthorized" })
          )
          observer.next({ type: "CONNECT_OK", payload: { socket } })
          observer.next({
            type: "JOIN_MAIN",
            params: { user_id: id, socket }
          })
        })
      )
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
          channel.on("my_chats", chats => console.log(chats)) //setup my chats here
          channel.on("presence_state", payload =>
            console.log("presense state", payload)
          ) //setup online presences here
          channel.on("new:msg", ({ message }) => {
            //i am receiving a message
            observer.next({ type: "GET_MESSAGE", payload: { message } })
            //need to notify other of receiving their message
            channel.push("received", { message })
          })
          //all these bellow are handled in chat reducer
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
  newChat: (action$: Observable<Action>) => action$.pipe()
}
