//@flow
import type { Action } from "../actions/types"
import type { User } from "../dataTypes"

type State = {
  user: ?User,
  token: ?string,
  error: ?(string | Object),
  signedUp: boolean
}
const init: State = {
  user: null,
  token: null,
  error: null,
  signedUp: false
}

export default (state: State = init, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
    case "SIGN_UP":
      return { ...state }
    case "SIGN_UP_OK":
      return { ...init, signedUp: true }
    case "LOGIN_OK":
      const { user, token } = action.payload
      return { ...init, user, token }
    case "LOGIN_ERROR":
    case "SIGN_UP_ERROR":
      return { ...state, error: action.error }
    case "LOGOUT":
      return init
    default:
      return state
  }
}
