import { mergeMap, catchError, map } from "rxjs/operators"
import { of } from "rxjs"
import { ajax } from "rxjs/ajax"
import type { Observable } from "rxjs"
import { ofType } from "redux-observable"
import type { Action } from "./types"
import { baseURL, headers } from "../constants/networking"

export const authActions: { [key: string]: (...args: any) => Action } = {
  signUp: (name: string, email: string, password: string) => ({
    type: "SIGN_UP",
    params: { name, email, password }
  }),
  login: (email: string, password: string) => ({
    type: "LOGIN",
    params: { email, password }
  })
}
export default {
  signUp: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("SIGN_UP"),
      mergeMap(action =>
        ajax.post(baseURL + "sign_up", { user: action.params }, headers).pipe(
          map(_resp => ({ type: "SIGN_UP_OK", payload: "registered" })),
          catchError(errors => of({ type: "SIGN_UP_ERROR", errors }))
        )
      )
    ),
  login: (action$: Observable<Action>) =>
    action$.pipe(
      ofType("LOGIN"),
      mergeMap(action =>
        ajax
          .post(baseURL + "sign_in", { session: action.params }, headers)
          .pipe(
            map(resp => ({
              type: "LOGIN_OK",
              payload: { user: resp.user, token: resp.jwt }
            })),
            catchError(error => of({ type: "LOGIN_ERROR", error }))
          )
      )
    )
}
