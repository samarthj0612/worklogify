import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();

      setTimeout(() => {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }, 1000);
    };

    prepare();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
