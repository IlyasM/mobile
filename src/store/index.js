import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import rootEpic from "./rootEpic";

const persistConfig = {
   key: "root",
   storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const epicMiddleware = createEpicMiddleware();
const enhancer = composeWithDevTools({})(applyMiddleware(epicMiddleware));
const store = createStore(persistedReducer, enhancer);
epicMiddleware.run(rootEpic);
const persistor = persistStore(store);
export default () => {
   return { store, persistor };
};
