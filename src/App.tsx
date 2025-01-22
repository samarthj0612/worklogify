import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./navigation/MainNavigator";

function RootNavigator() {
  return <MainNavigator />;
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
      <RootNavigator />
    </NavigationContainer>
  );
}
