//@flow
import React from "react"
import { createSwitchNavigator } from "react-navigation"
import HomeNavigator from "./homeNavigator"
import AuthNavigator from "./authNavigator"
import AuthLoadingScreen from "./authLoading"
export default createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Home: HomeNavigator,
    AuthLoading: AuthLoadingScreen
  },
  { initialRouteName: "AuthLoading" }
)
