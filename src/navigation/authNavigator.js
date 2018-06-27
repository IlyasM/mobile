//@flow
import React from "react"
import { createStackNavigator } from "react-navigation"
import SignUpScreen from "../containers/signUp"
import LoginScreen from "../containers/login"

export default createStackNavigator({
  SignUp: SignUpScreen,
  Login: LoginScreen
})
