//@flow
import React from "react";
import { createSwitchNavigator } from "react-navigation";
import HomeNavigator from "./homeNavigator";
import AuthNavigator from "./authNavigator";

export default createSwitchNavigator({
   Auth: AuthNavigator,
   Home: HomeNavigator
});
