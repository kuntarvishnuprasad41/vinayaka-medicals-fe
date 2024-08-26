import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { BASE_URL } from "../../../app-logic/base-url";

const PaymentsScreen = ({ route }) => {
  const { storeId } = route.params; // Get storeId from route params
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [payments, setPayments] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Authorization Error", "You are not logged in.");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/api/stores/${storeId}/payments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
          if (data.length > 0) {
            setStoreName(data[0].user.name); // Assuming the name is the same for all entries
          }
        } else {
          Alert.alert("Error", "Failed to fetch payments.");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        Alert.alert("Error", "An error occurred while fetching payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [storeId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#FFFFFF" : "#000000"}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6" },
      ]}
    >
      <Text
        style={[
          styles.headerText,
          { color: isDarkMode ? "#FFFFFF" : "#3B82F6" },
        ]}
      >
        Payments for {storeName}
      </Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.paymentItem,
              { backgroundColor: isDarkMode ? "#374151" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.paymentText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Bill Number: {item.billNumber}
            </Text>
            <Text
              style={[
                styles.paymentText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Amount: ${item.amount}
            </Text>
            <Text
              style={[
                styles.paymentText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Payment Type: {item.type}
            </Text>
            <Text
              style={[
                styles.paymentText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Amount Paid: ${item.amountPaid}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentText: {
    fontSize: 16,
  },
});

export default PaymentsScreen;
