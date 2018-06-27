/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"
import { Provider } from "react-redux"
import configureStore from "./src/store"
import { PersistGate } from "redux-persist/integration/react"
import SwitchNavigator from "./src/navigation/appNavigator"
import Loading from "./src/components/loading"
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
})
let { store, persistor } = configureStore()
type Props = {}
export default class App extends Component<Props> {
  componentDidMount() {
    persistor.purge()
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
})
