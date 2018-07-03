//@flow
import type { Action } from "../actions/types"
import type { User } from "../dataTypes"

type State = {
  user: ?User,
  token: ?string,
  signUpError: ?{ email: Array<string> },
  loginError: ?string,
  signedUp: boolean
}
const init: State = {
  user: null,
  token: null,
  loginError: null,
  signUpError: null,
  signedUp: false
}

export default (state: State = init, action: Action): State => {
  switch (action.type) {
    case "SIGN_UP_OK":
      return { ...init, signedUp: true }
    case "LOGIN_OK":
      const { user, token } = action.payload
      return { ...init, user, token }
    case "LOGIN_ERROR":
      return { ...state, loginError: action.error }
    case "SIGN_UP_ERROR":
      return { ...init, signUpError: action.error }
    case "LOGOUT":
      return init
    default:
      return state
  }
}
