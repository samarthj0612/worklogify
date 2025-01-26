import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

const Register = ({ navigation }: any) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const { register } = useAuth();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { name, phone, email, password } = form;

    if (!name || !phone || !email || !password) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      await register(email, password, { name, phone });
      Alert.alert("Success", "Registration complete!");
      navigation.navigate("login");
    } catch (error: any) {
      console.error("Registration Error:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred during registration."
      );
    }
  };

  const isFormValid = Object.values(form).every((field) => field !== "");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(value) => handleChange("phone", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        autoCapitalize="none"
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate("login")}>
        Already have an account? Login
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
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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

export default Register;
