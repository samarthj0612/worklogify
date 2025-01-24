import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./navigation/MainNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    };
    prepare();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
