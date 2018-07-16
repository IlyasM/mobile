/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react"
import { Platform, Text, View, YellowBox } from "react-native"
import { Provider } from "react-redux"
import configureStore from "./src/store"
import { PersistGate } from "redux-persist/integration/react"
import SwitchNavigator from "./src/navigation/appNavigator"
import Loading from "./src/components/loading"

YellowBox.ignoreWarnings(["Warning: isMounted(...)", "Module RCTImageLoader"])

let { store, persistor } = configureStore()
type Props = {}
export default class App extends Component<Props> {
  componentDidMount() {
    //  persistor.purge()
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <SwitchNavigator />
        </PersistGate>
      </Provider>
    )
  }
}
