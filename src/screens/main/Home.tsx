import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
