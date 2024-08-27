import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { BASE_URL } from "../../utils/BaseUrl";

const PaymentsScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payments, setPayments] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error retrieving auth token:", error);
      return null;
    }
  };

  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const authToken = await getAuthToken();
        if (!authToken) {
          Alert.alert("Error", "User not authenticated");
          return;
        }

        const response = await fetch(BASE_URL + "/stores", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        Alert.alert("Error", "Failed to fetch stores. Please try again.");
      }
    };

    fetchStores();
  }, []);

  // Fetch payments when store or date changes
  useEffect(() => {
    if (selectedStore) {
      fetchPayments();
    }
  }, [selectedStore, date]);

  const fetchPayments = async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const response = await fetch(
        BASE_URL + `/payments?storeId=${selectedStore}&date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setPayments(data.payments);
      setTotalToday(data.totalToday);
      setOpeningBalance(data.openingBalance);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Alert.alert("Error", "Failed to fetch payments. Please try again.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.billNumber}</Text>
      <Text style={styles.tableCell}>{item.amount.toFixed(2)}</Text>
      <Text style={styles.tableCell}>{item.amountPaid.toFixed(2)}</Text>
      <Text style={styles.tableCell}>{item.paymentType}</Text>
      <Text style={styles.tableCell}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6" },
      ]}
      className="pt-20"
    >
      <Text
        style={[
          styles.headerText,
          { color: isDarkMode ? "#FFFFFF" : "#3B82F6" },
        ]}
      >
        Select Store
      </Text>
      <Picker
        selectedValue={selectedStore}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedStore(itemValue)}
      >
        <Picker.Item label="Select a store" value="" />
        {stores.map((store) => (
          <Picker.Item key={store.id} label={store.name} value={store.id} />
        ))}
      </Picker>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Select Date: {date.toISOString().split("T")[0]}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView>
        <View
          style={[
            styles.tableHeader,
            { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
          ]}
        >
          <Text style={styles.tableHeaderCell}>Bill No</Text>
          <Text style={styles.tableHeaderCell}>Amount </Text>
          <Text style={styles.tableHeaderCell}>Amount Paid</Text>
          <Text style={styles.tableHeaderCell}>Payment Type</Text>
          <Text style={styles.tableHeaderCell}>Time</Text>
        </View>

        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.table}
        />
      </ScrollView>
      <View
        style={[
          styles.summaryContainer,
          { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
        ]}
      >
        <Text
          style={[
            styles.summaryText,
            { color: isDarkMode ? "#FFFFFF" : "#3B82F6" },
          ]}
        >
          Total Today: {totalToday.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.summaryText,
            { color: isDarkMode ? "#FFFFFF" : "#3B82F6" },
          ]}
        >
          Opening Balance: {openingBalance.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  dateButton: {
    padding: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  dateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default PaymentsScreen;
