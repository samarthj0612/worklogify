import React, { useEffect } from "react";
import * as Progress from "react-native-progress";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

import SvgIcon from "../../components/SvgIcon";
import Divider from "../../components/Divider";
import ProfileImage from "../../assets/images/samarth-jain.jpg";

import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useActivityLogs } from "../../utils/activity";

const HomeScreen = ({ navigation }: any) => {
  const { user, fetchUserDetails } = useAuth();
  const { data: activities, isLoading: isActivitiesLoading, refetch } = useActivityLogs(user?.id);

  const fetchTasksCount = async (userId: any) => {
    if (!userId) return { total: 0, pending: 0, completed: 0 };

    try {
      const totalSnapshot = await getCountFromServer(
        query(collection(db, "tasks"), where("userId", "==", userId))
      );
      const totalTasks = totalSnapshot.data().count;
  
      const completedSnapshot = await getCountFromServer(
        query(collection(db, "tasks"), where("userId", "==", userId), where("status", "==", true))
      );
      const completedTasks = completedSnapshot.data().count;
      const pendingTasks = totalTasks - completedTasks;

      return { total: totalTasks, pending: pendingTasks, completed: completedTasks };
    } catch (error) {
      console.error("Error fetching task counts:", error);
      return { total: 0, pending: 0, completed: 0 };
    }
  };

  const { data: tasksCount, isLoading: isTasksLoading } = useQuery({
    initialData: { total: 0, pending: 0, completed: 0 },
    queryKey: ["tasksCount", user?.id],
    queryFn: () => fetchTasksCount(user?.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [user]);

  if (!user) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  const widgetHandler = () => {
    console.log("Add widget handler");
  };

  const getActivityIcon = (type?: string) => {
    if (type === "login" || type === "logout") {
      return <SimpleLineIcons name={type} size={14} />;
    } else if (type === "add-task") {
      return <MaterialIcons name={type} size={16} />;
    } else if (type === "list-status") {
      return <MaterialCommunityIcons name={type} size={16} />;
    } else if (type === "add-log") {
      return <MaterialIcons name={"format-list-bulleted-add"} size={16} />;
    } else if (type === "export-logs") {
      return <MaterialCommunityIcons name={"export-variant"} size={16} />;
    } else {
      return <Feather name="activity" size={16} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => console.log("Menu pressed")}>
          <SvgIcon name="menu" size={28} />
        </TouchableOpacity>
        <View style={styles.flexBetween}>
          {user && user.role && user.role === "ADMIN" ? (
            <TouchableOpacity onPress={() => navigation.navigate("Dev")}>
              <MaterialIcons name="build" size={28} />
            </TouchableOpacity>
          ) : null}
          <Image
            style={styles.profileImage}
            source={ProfileImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={{ alignItems: "flex-start" }}>
        <Text style={styles.greetText}>
          Hello, {user?.name.split(" ")[0] ?? ""}
        </Text>
        <View>
          <Text style={styles.bigHeading}>{"Welcome"}</Text>
          <Text style={[styles.greetText, { alignSelf: "flex-end" }]}>
            To Worklogify
          </Text>
        </View>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousalContent}
        >
          <View style={[styles.carousalTile, { backgroundColor: "#F9E9C8" }]}>
            <View style={styles.flexBetween}>
              <Entypo name="suitcase" size={24} color="#000" />
              <Feather
                name="arrow-up-right"
                onPress={() => navigation.navigate("Tasks")}
                size={24}
                color="#000"
              />
            </View>
            <Text style={{ fontSize: 32 }}>Tasks</Text>
            {isTasksLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {`Pending: ${tasksCount.pending}\nCompleted: ${tasksCount.completed}`}
                </Text>
                <View style={styles.flexBetween}>
                  <Progress.Bar
                    progress={
                      tasksCount.pending
                        ? tasksCount.completed / tasksCount.total
                        : 1
                    }
                    width={200}
                    color="#000"
                  />
                  {tasksCount.pending ? (
                    <MaterialIcons
                      name="pending-actions"
                      size={24}
                      color="#000"
                    />
                  ) : (
                    <MaterialIcons name="check-circle" size={24} color="#000" />
                  )}
                </View>
              </>
            )}
          </View>

          <View style={[styles.carousalTile, { backgroundColor: "#DEECED" }]}>
            <View style={styles.flexBetween}>
              <Entypo name="laptop" size={24} color="#000" />
              <TouchableOpacity onPress={() => navigation.navigate("Meetings")}>
                <Feather name="arrow-up-right" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 32 }}>Upcoming meetings</Text>
            <View style={styles.flexBetween}>
              <Progress.Bar progress={1} width={200} color="#000" />
              <MaterialIcons name="check-circle" size={24} color="#000" />
            </View>
          </View>

          <View
            style={[
              styles.carousalTile,
              {
                backgroundColor: "lightgrey",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <TouchableOpacity onPress={widgetHandler}>
              <AntDesign name="pluscircleo" size={60} color="grey" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.topBar}>
        <Text style={styles.recentActivity}>Recent Activity</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} />
        </TouchableOpacity>
      </View>

      <Divider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {activities && activities.length
          ? activities.map((e, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  {getActivityIcon(e.type)}
                  <Text style={{ flex: 1, fontSize: 16 }}>{e.activity}</Text>
                  <Text style={{ color: "grey", fontSize: 12, textAlign: "right" }}>
                    {moment(e.createdAt).format("HH:mm DD/MM/YYYY").split(" ").join("\n")}
                  </Text>
                </View>
              );
            })
          : isActivitiesLoading && (
              <ActivityIndicator size="large" style={styles.loading} />
            )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

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
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: "black",
    marginStart: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  greetText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },

  bigHeading: {
    fontSize: 70,
    lineHeight: 75,
    fontWeight: "bold",
  },

  carousalContent: {
    marginVertical: 16,
    paddingVertical: 16,
  },

  carousalTile: {
    height: 220,
    width: 280,
    backgroundColor: "#F9E9C8",
    borderRadius: 20,
    marginEnd: 20,
    padding: 16,
    justifyContent: "space-between",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recentActivity: {
    fontSize: 18,
    fontWeight: "bold",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
  },

  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
