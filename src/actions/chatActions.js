import { map } from "rxjs/operators";
import { ofType } from "redux-observable";

export const chatActions = {
   getList() {
      return { type: "LIST_USERS" };
   }
};

export default {
   getList(action$: Observable<any>) {
      return action$.pipe(
         ofType("LIST_USERS"),
         map(
            action =>
               console.log("epics") || {
                  type: "LIST_USERS_OK",
                  payload: "lala"
               }
         )
      );
   }
};
