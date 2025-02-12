import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainNavigator from "./navigation/MainNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AuthProvider>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar style="auto" />
            <RootNavigator />
          </SafeAreaView>
        </AuthProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
})