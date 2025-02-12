import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

import Divider from "../../components/Divider";
import CustomModal from "../../components/CustomModal";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { TaskSchema } from "../../types";
import { createActivityLog } from "../../utils/activity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TasksScreen = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  
  const { user, fetchUserDetails } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [user]);

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setError("");
    setModalVisible(false);
  }

  const fetchTasks = async () => {
    if(!user?.id) return [];

    try {
      const q = query(collection(db, "tasks"), where("userId", "==", user.id));
      const querySnapshot = await getDocs(q);
      const fetchedTasks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          status: data.status,
          createdAt: data.createdAt,
        } as TaskSchema;
      });
      
      return fetchedTasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };
  
  // Fetch Tasks using useQuery
  const { data: tasks, isLoading, refetch } = useQuery({
    initialData: [],
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Mutation to Add Task
  const { mutate: addTaskMutation, isPending: isTaskAdded} = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("UserId not found!");
      }
      if (!title || !description) {
        throw new Error("Mandatory params missing!");
      }

      const docRef = doc(collection(db, "tasks"));
      const docData = {
        id: docRef.id,
        userId: user.id,
        title,
        description,
        status: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, docData);
      createActivityLog("Added task with ID: " + docRef.id, "add-task", user.id);
      return docData;
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(["tasks"], (oldTasks: TaskSchema[] = []) => [
        newTask,
        ...oldTasks,
      ]);
      Alert.alert("Task added successfully with ID: " + newTask.id);
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["tasksCount", user.id] });
        queryClient.invalidateQueries({ queryKey: ["activities", user.id] });
      }
      clearFields();
    },
    onError: (error) => setError(error.message),
  });

  // Mutation to Toggle Task Completion
  const { mutate: toggleTaskMutation, isPending: isStatusUpdated} = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      if(!user?.id) return;
      await updateDoc(doc(db, "tasks", taskId), { status: !isCompleted });
      createActivityLog("Updated status of task with ID: " + taskId, "list-status", user?.id);
    },
    onSuccess: (_, { taskId, isCompleted }) => {
      queryClient.setQueryData(["tasks"], (oldTasks: TaskSchema[] = []) =>
        oldTasks.map((task) =>
          task.id === taskId ? { ...task, status: !isCompleted } : task
        )
      );
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["tasksCount", user.id] });
        queryClient.invalidateQueries({ queryKey: ["activities", user.id] });
      }
    },
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.taskToday}>Tasks Today</Text>
        { isLoading || isStatusUpdated ? <ActivityIndicator size="small" /> : null }
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} />
        </TouchableOpacity>
      </View>

      <Divider />

      {tasks && tasks.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {tasks.map((task, idx) => {
            return (
              <View key={idx} style={styles.taskCard}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text>{task.description}</Text>
                </View>
                <Checkbox onPress={() => toggleTaskMutation({ taskId: task.id, isCompleted: task.status })} status={task.status ? "checked" : "unchecked"} />
              </View>
            );
          })}
        </ScrollView>
      ) : null}

      <CustomModal
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Text style={styles.modalTitle}>Add Task</Text>
        <TextInput
          placeholder="Task"
          value={title}
          onChangeText={setTitle}
          style={styles.textInput}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.textInput}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          <Button style={{ ...styles.modalActionButton, ...styles.buttonText }} buttonColor="#ccc" onPress={clearFields} >
            Cancel
          </Button>
          <Button loading={isTaskAdded} style={{ ...styles.modalActionButton, ...styles.addButton }} onPress={() => addTaskMutation()} labelStyle={styles.buttonText} >
            Add
          </Button>
        </View>
      </CustomModal>
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },

  taskToday: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
  },

  taskCard: {
    borderRadius: 6,
    padding: 15,
    shadowColor: "#000",
    elevation: 4,
    backgroundColor: "white",
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginHorizontal: 2,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },

  errorText: {
    color: "red",
    marginBottom: 10,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  modalActionButton: {
    borderRadius: 8,
    padding: 4,
    flex: 1,
  },

  addButton: {
    backgroundColor: "#007BFF",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
