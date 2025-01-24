import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (email === "") {
      Alert.alert("Error", "Please enter your email.");
    } else {
      console.log("Password reset email sent to:", email);
      Alert.alert(
        "Success",
        "If an account exists with this email, you will receive a password reset link."
      );
      navigation.navigate("login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your registered email address to receive a password reset link.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, email === "" && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={email === ""}
      >
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate("login")}>
        Back to Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#007bff",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
});

export default ForgotPassword;
