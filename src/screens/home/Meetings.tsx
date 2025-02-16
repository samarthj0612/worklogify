import { View, Text, StyleSheet } from "react-native";
import React from "react";

const MeetingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Meetings Screen</Text>
    </View>
  );
};

export default MeetingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
});
