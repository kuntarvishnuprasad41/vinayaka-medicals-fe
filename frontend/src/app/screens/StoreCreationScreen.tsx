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
import { BASE_URL } from "../../utils/BaseUrl";

const StoreCreationScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleCreateStore = async () => {
    if (!storeName || !storeAddress) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      // Replace with your API URL
      const response = await fetch(BASE_URL + "/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add token in headers if required for authentication
          // Authorization: `Bearer ${yourToken}`,
        },
        body: JSON.stringify({
          name: storeName,
          address: storeAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Store created successfully!");
        // Optionally, navigate to the Add User screen or clear the form
        setStoreName("");
        setStoreAddress("");
      } else {
        Alert.alert("Error", data.error || "Failed to create store");
      }
    } catch (error) {
      console.error("Error creating store:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating the store. Please try again."
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
          Create a New Store
        </Text>
      </View>

      <View
        style={[
          styles.formContainer,
          { backgroundColor: isDarkMode ? "#374151" : "#FFFFFF" },
        ]}
      >
        <TextInput
          placeholder="Store Name"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={storeName}
          onChangeText={setStoreName}
        />

        <TextInput
          placeholder="Store Address"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={storeAddress}
          onChangeText={setStoreAddress}
        />

        <TouchableOpacity
          onPress={handleCreateStore}
          style={[
            styles.saveButton,
            { backgroundColor: isDarkMode ? "#10B981" : "#22C55E" },
          ]}
        >
          <Text style={styles.saveButtonText}>Create Store</Text>
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

export default StoreCreationScreen;
