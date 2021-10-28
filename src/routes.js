import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, LoginScreen } from "./components/screens";

const Stack = createStackNavigator();

const RouteStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ title: "login" }}
      />
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: "Home" }}
      />
    </Stack.Navigator>
  );
};

export default RouteStack;