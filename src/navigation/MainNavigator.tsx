import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/main/Home";
import LogsScreen from "../screens/main/Logs";
import ProfileScreen from "../screens/main/Profile";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap: { [key: string]: string } = {
            Home: focused ? "home" : "home",
            Logs: focused ? "format-list-bulleted" : "format-list-bulleted",
            Profile: focused ? "person" : "person-outline",
          };

          const iconName: any = iconMap[route.name] || "help";

          return (
            <MaterialIcons
              name={iconName}
              size={size || 24}
              color={color || "#000"}
            />
          );
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#777",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
