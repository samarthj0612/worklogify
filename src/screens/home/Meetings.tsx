import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Divider from "../../components/Divider";
import moment from "moment";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const dateOptions = {
  today: moment().format("DD-MM-YYYY"),
  yesterday: moment().subtract(1, "days").format("DD-MM-YYYY"),
  tomorrow: moment().add(1, "days").format("DD-MM-YYYY"),
}

const MeetingsScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState(moment().format("DD-MM-YYYY"));
  const [customDate, setCustomDate] = useState("");

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (_, date) => {
        if (date){
          setSelectedDate(customDate);
          setCustomDate(customDate);
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topTab}>
          <Text style={styles.topTabText1}>Hello Samarth</Text>
          <TouchableOpacity style={styles.createMeetingBtn} onPress={() => navigation.navigate("Dev")} >
            <MaterialCommunityIcons name="plus" color={"white"} size={16} />
            <Text style={styles.createMeetingBtnText}>Create meeting</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.topTabText2}>Lets get started</Text>
      </View>

      <Divider />

      <View style={styles.topTab}>
        <TouchableOpacity onPress={() => setSelectedDate(dateOptions.yesterday)}>
          <Text style={[ styles.topTabDate, { color: dateOptions.yesterday == selectedDate ? "#216DFF" : "" } ]}>Yesterday</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedDate(dateOptions.today)}>
          <Text style={[ styles.topTabDate, { color: dateOptions.today == selectedDate ? "#216DFF" : "" } ]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedDate(dateOptions.tomorrow)}>
          <Text style={[ styles.topTabDate, { color: dateOptions.tomorrow == selectedDate ? "#216DFF" : "" } ]}>Tomorrow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openDatePicker}>
          <MaterialCommunityIcons name="calendar" size={24} color={customDate ? "#216DFF" : ""} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeetingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  topTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topTabText1: {
    fontSize: 32,
    fontWeight: "bold",
  },

  createMeetingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#216DFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  createMeetingBtnText: {
    fontSize: 16,
    color: "white",
  },

  topTabText2: {
    fontSize: 18,
    color: "grey",
    fontWeight: "bold",
  },

  topTabDate: {
    fontSize: 20,
    fontWeight: "bold",
  }
});
