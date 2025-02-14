import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import moment from "moment";
import { FAB, List } from "react-native-paper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { LogSchema } from "../../types";
import { db } from "../../firebase/config";

import Divider from "../../components/Divider";
import CustomModal from "../../components/CustomModal";
import { createActivityLog } from "../../utils/activity";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";

const LogsScreen = () => {
  const [error, setError] = useState<string>("")
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [comment, setComment] = useState<string>("");

  const { user } = useAuth();
  
  const fetchLogs = async () => {
    if (!user?.id) return [];

    try {
      const logRef = doc(db, "logs", user.id);
      const docSnap = await getDoc(logRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const logsForUser = Object.keys(data).map((date) => ({
          date,
          logs: data[date] || [], // Ensure there's a default empty array for logs
        }));
  
        return logsForUser;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      return [];
    }
  };

  const { data: logs, isLoading, refetch } = useQuery({
    initialData: [],
    queryKey: ["logs"],
    queryFn: fetchLogs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
  
  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      onChange: (_, date) => {
        if (date) setSelectedDate(date);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const clearFields = useCallback(() => {
    setComment("");
    setSelectedDate(new Date());
    setError("");
    setModalVisible(false);
  }, []);
  

  const { mutate: handleAddLog, isPending: isLogAdded } = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) {
        throw new Error("Comment cannot be empty.");
      }
    
      if (!user || !user.id) {
        throw new Error("User data not found");
      }
    
      const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
      const logRef = doc(db, "logs", user.id);
    
      try {
        const docSnap = await getDoc(logRef);
    
        if (docSnap.exists()) {
          await updateDoc(logRef, {
            [formattedDate]: arrayUnion(comment),
          });
        } else {
          await setDoc(logRef, {
            [formattedDate]: [comment],
          });
        }
  
        return { formattedDate, userId: user.id };
      } catch (error) {
        console.error("Error adding log:", error);
        throw new Error("Failed to add log. Try again.");
      }
    },
    onSuccess: ({ formattedDate, userId }) => {
      refetch();
      clearFields();
      createActivityLog("Added log for " + formattedDate, "add-log", userId);
    },
    onError: (error) => setError(error.message),
  });

  const groupLogsByMonth = (): {
    [key: string]: { date: string; logs: string[] }[];
  } => {
    return logs.reduce((acc: { [key: string]: LogSchema[] }, log) => {
      const month = moment(log.date, "DD-MM-YYYY").format("MMMM YYYY");
      if (!acc[month]) acc[month] = [];
      acc[month].push(log);
      return acc;
    }, {});
  };

  const groupedLogs = groupLogsByMonth();

  return (
    <View style={styles.container}>
      <FAB
        icon="plus"
        size="medium"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <View style={styles.topBar}>
        <Text style={styles.workLogTitle}>WorkLogs</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} />
        </TouchableOpacity>
      </View>

      <Divider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {groupedLogs && Object.keys(groupedLogs).length ? (
          <List.AccordionGroup>
            {Object.keys(groupedLogs).map((month, index) => (
              <List.Accordion title={month} id={index.toString()} key={index}>
                <List.AccordionGroup>
                  {groupedLogs[month].map((log, logIndex) => (
                    <List.Accordion
                      title={log.date}
                      id={`${index}-${logIndex}`}
                      key={`${index}-${logIndex}`}
                      style={{ paddingLeft: 20 }}
                    >
                      {log.logs.map((comment, commentIndex) => (
                        <List.Item
                          key={commentIndex}
                          title={comment}
                          titleNumberOfLines={0}
                          style={{ paddingLeft: 40 }}
                        />
                      ))}
                    </List.Accordion>
                  ))}
                </List.AccordionGroup>
              </List.Accordion>
            ))}
          </List.AccordionGroup>
        ) : isLoading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : null}
      </ScrollView>

      <CustomModal
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Text style={styles.modalTitle}>Add Worklog</Text>
        <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            { selectedDate ? moment(selectedDate).format("DD MMMM YYYY") : "Select Date (defaults to today)" }
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter comment"
          value={comment}
          onChangeText={setComment}
          style={styles.textInput}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={clearFields}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddLog()}
          >
            {isLogAdded && <ActivityIndicator color="white" />}
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

export default LogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  workLogTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
  },

  fab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
    zIndex: 99
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },

  dateText: {
    fontSize: 16,
    color: "#555",
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
  },

  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 8,
  },

  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginLeft: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
