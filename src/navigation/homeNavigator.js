//@flow
import React from "react";
import { createStackNavigator } from "react-navigation";
import HomeScreen from "../containers/home";
import ChatScreen from "../containers/chat";

export default createStackNavigator({
   Home: HomeScreen,
   Chat: ChatScreen
});
