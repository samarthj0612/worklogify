import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/Login";
import RegisterScreen from "../screens/auth/Register";
import ForgotPasswordScreen from "../screens/auth/ForgotPassword";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="register"
        component={RegisterScreen}
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="forgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password" }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
