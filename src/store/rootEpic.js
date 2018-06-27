import values from "lodash/values";
import { combineEpics } from "redux-observable";
import chatEpics from "../actions/chatActions";
//currently combine epics receives list of epic functions
import { Observable } from "rxjs";
export default combineEpics(...values({ ...chatEpics }));
