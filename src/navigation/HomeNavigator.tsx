import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/main/Home";
import DevelopmentScreen from '../screens/home/Development';
import MeetingsScreen from '../screens/home/Meetings';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dev" component={DevelopmentScreen} />
      <Stack.Screen name="Meetings" component={MeetingsScreen} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
