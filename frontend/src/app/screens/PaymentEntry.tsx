import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure you have AsyncStorage installed
import { BASE_URL } from "@/utils/BaseUrl";

const PaymentEntryScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("CASH"); // Default to 'cash'
  const [amountPaid, setAmountPaid] = useState("");

  const handleSave = async () => {
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      // Make sure all fields are filled out
      if (!billNumber || !amount || !amountPaid || !paymentType) {
        Alert.alert("Error", "Please fill out all fields");
        return;
      }

      // API call to save payment details
      const response = await fetch(BASE_URL + "/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token for authorization
        },
        body: JSON.stringify({
          billNumber,
          amount: parseFloat(amount), // Ensure amount is sent as a number
          amountPaid: parseFloat(amountPaid), // Ensure amountPaid is sent as a number
          paymentType,
          storeId: 1, // Replace with the actual storeId or fetch it dynamically
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Payment details saved successfully");
        // Optionally clear the form
        setBillNumber("");
        setAmount("");
        setAmountPaid("");
        setPaymentType("CASH");
      } else {
        Alert.alert("Error", data.error || "Failed to save payment details");
      }
    } catch (error) {
      console.error("Error saving payment details:", error);
      Alert.alert(
        "Error",
        "An error occurred while saving payment details. Please try again."
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerText,
            { color: isDarkMode ? "#FFFFFF" : "#3B82F6" },
          ]}
        >
          Enter Payment Details
        </Text>
      </View>

      <View
        style={[
          styles.formContainer,
          { backgroundColor: isDarkMode ? "#374151" : "#FFFFFF" },
        ]}
      >
        <TextInput
          placeholder="Bill Number"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={billNumber}
          onChangeText={setBillNumber}
        />

        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={amount}
          onChangeText={setAmount}
        />

        <TextInput
          placeholder="Amount Paid"
          keyboardType="numeric"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={amountPaid}
          onChangeText={setAmountPaid}
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => setPaymentType("CASH")}
            style={[
              styles.paymentButton,
              paymentType === "CASH"
                ? { backgroundColor: isDarkMode ? "#6D28D9" : "#4F46E5" }
                : { backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB" },
            ]}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentType === "CASH"
                  ? { color: "#FFFFFF" }
                  : { color: isDarkMode ? "#9CA3AF" : "#000000" },
              ]}
            >
              CASH
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentType("UPI")}
            style={[
              styles.paymentButton,
              paymentType === "UPI"
                ? { backgroundColor: isDarkMode ? "#6D28D9" : "#4F46E5" }
                : { backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB" },
            ]}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentType === "UPI"
                  ? { color: "#FFFFFF" }
                  : { color: isDarkMode ? "#9CA3AF" : "#000000" },
              ]}
            >
              UPI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentType("CREDIT")}
            style={[
              styles.paymentButton,
              paymentType === "CREDIT"
                ? { backgroundColor: isDarkMode ? "#6D28D9" : "#4F46E5" }
                : { backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB" },
            ]}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentType === "CREDIT"
                  ? { color: "#FFFFFF" }
                  : { color: isDarkMode ? "#9CA3AF" : "#000000" },
              ]}
            >
              CREDIT
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            { backgroundColor: isDarkMode ? "#10B981" : "#22C55E" },
          ]}
        >
          <Text style={styles.saveButtonText}>Save Payment Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentEntryScreen;
