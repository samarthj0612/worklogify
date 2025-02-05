import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { FAB, List } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { LogSchema } from "../../types";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Divider from "../../components/Divider";

const LogsScreen = () => {
  const [logs, setLogs] = useState<LogSchema[]>([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddLog = () => {
    const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
    const existingLogIndex = logs.findIndex(
      (log) => log.date === formattedDate
    );

    if (existingLogIndex !== -1) {
      // Add to existing date's logs
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex].logs.push(comment);
      setLogs(updatedLogs);
    } else {
      // Add new date with log
      setLogs((prevLogs) => [
        ...prevLogs,
        { date: formattedDate, logs: [comment] },
      ]);
    }

    // Reset modal fields and close modal
    setComment("");
    setSelectedDate(new Date());
    setModalVisible(false);
  };

  const groupLogsByMonth = (): {
    [key: string]: { date: string; logs: string[] }[];
  } => {
    return logs.reduce(
      (acc: { [key: string]: { date: string; logs: string[] }[] }, log) => {
        const month = moment(log.date, "DD-MM-YYYY").format("MMMM YYYY");
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(log);
        return acc;
      },
      {}
    );
  };

  const groupedLogs = groupLogsByMonth();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.taskToday}>WorkLogs</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="refresh" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} />
        </TouchableOpacity>
      </View>

      <Divider />

      { groupedLogs && Object.keys(groupedLogs).length ? (
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
    ) : isLoading ? <ActivityIndicator size="large" style={styles.loading} /> : null }

      <FAB
        icon="plus"
        size="medium"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Worklog</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={styles.datePicker}
            >
              <Text style={styles.dateText}>
                {selectedDate
                  ? moment(selectedDate).format("DD MMMM YYYY")
                  : "Select Date (defaults to today)"}
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Enter comment"
              value={comment}
              onChangeText={setComment}
              style={styles.textInput}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddLog}
                disabled={!comment.trim()}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 15
  },

  taskToday: {
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
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
