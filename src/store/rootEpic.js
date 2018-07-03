import values from "lodash/values"
import { combineEpics } from "redux-observable"
import chat from "../actions/chatActions"
import auth from "../actions/authActions"
import home from "../actions/homeActions"
//currently combine epics receives list of epic functions
import { Observable } from "rxjs"
export default combineEpics(...values({ ...auth, ...home, ...chat }))
