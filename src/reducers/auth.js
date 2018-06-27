//@flow
import type { Action } from "../actions/types"
import type { User } from "../dataTypes"

type State = {
  user: ?User,
  token: ?string,
  error: any,
  loading: boolean
}
const init: State = { user: null, token: null, error: null, loading: false }

export default (state: State = init, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
    case "SIGN_UP":
      return { ...state, loading: true }
    case "LOGIN_OK":
      const { user, token } = action.payload
      return { ...state, user, token, loading: false }
    case "LOGIN_ERROR":
    case "SIGN_UP_ERROR":
      const error = action.error
      return { ...state, error, loading: false }
    case "LOGOUT":
      return init
    default:
      return state
  }
}
