import React, { useEffect } from "react";
import { DataTable } from "react-native-paper";
import { Image, ScrollView } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ProfileImage from "../../assets/images/samarth-jain.jpg";
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
      <View style={styles.appBar}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Image
            style={styles.profileImage}
            source={ProfileImage}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.quoteText}>If you can think it,</Text>
            <Text style={styles.quoteText}>You can make it</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout}>
          <AntDesign name="logout" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.title}>Profile</Text>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>UserId</DataTable.Cell>
            <DataTable.Cell>{user?.id}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Name</DataTable.Cell>
            <DataTable.Cell>{user?.name}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Email</DataTable.Cell>
            <DataTable.Cell>{user?.email}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Phone</DataTable.Cell>
            <DataTable.Cell>{user?.phone}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousalContent}>
          <View style={[ styles.carousalTile, { backgroundColor: "#F9E9C8" } ]}>
            <View>
              <FontAwesome name="quote-left" size={48} color="#000" />
            </View>
            <Text style={styles.quoteText}>
              If you think you are smarter in the room,
              then you are in the wrong room
            </Text>
          </View>

          <View style={[ styles.carousalTile, { backgroundColor: "#DEECED" } ]}>
            <View>
                <FontAwesome name="quote-left" size={48} color="#000" />
              </View>
              <Text style={styles.quoteText}>
                Don't think that if you are late, you will lose
              </Text>
          </View>

          <View style={[ styles.carousalTile, { backgroundColor: "lightgrey" } ]}>
            <View>
              <FontAwesome name="quote-left" size={48} color="#000" />
            </View>
            <Text style={styles.quoteText}>
              Something only seems impossible,
              until it happens
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },

  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  profileImage: {
    height: 45,
    width: 45,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 30,
    overflow: "hidden"
  },

  quoteText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  profileCard: {
    borderRadius: 8, 
    paddingVertical: 30,
    paddingHorizontal: 25,    
    shadowColor: '#000',  
    elevation: 10,
    backgroundColor: 'white',  
    marginVertical: 15, 
  },

  title: {
    fontSize: 24,
    marginBottom: 12,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
  },

  carousalContent: {
    marginVertical: 16,
    paddingVertical: 16
  },
  
  carousalTile: {
    width: 280,
    borderRadius: 15,
    marginEnd: 20,
    padding: 16,
  },

  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
