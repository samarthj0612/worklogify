import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../context/AuthContext";

const ProfileScreen = () => {
  const { user, fetchUserDetails, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [user]);

  if (!user) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Phone: {user.phone}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#ff4d4f",
    padding: 8,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
