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

// Replace with your API base URL

const PaymentEntryScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // Default to 'cash'
  const [amountPaid, setAmountPaid] = useState("");

  const handleSave = async () => {};

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
            onPress={() => setPaymentType("cash")}
            style={[
              styles.paymentButton,
              paymentType === "cash"
                ? { backgroundColor: isDarkMode ? "#6D28D9" : "#4F46E5" }
                : { backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB" },
            ]}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentType === "cash"
                  ? { color: "#FFFFFF" }
                  : { color: isDarkMode ? "#9CA3AF" : "#000000" },
              ]}
            >
              Cash
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
