import { BASE_URL } from "@/utils/BaseUrl";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  // Use Picker for dropdown
} from "react-native";
import { useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddUserScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);

  // Fetch the list of stores from the API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(BASE_URL + "/stores", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add token in headers if required for authentication
            // Authorization: `Bearer ${yourToken}`,
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

  const handleAddUser = async () => {
    if (!name || !email || !password || !storeId) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add token in headers if required for authentication
          // Authorization: `Bearer ${yourToken}`,
        },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
          storeId: parseInt(storeId, 10), // Convert storeId to a number
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "User added successfully!");
        // Optionally, clear the form
        setName("");
        setEmail("");
        setPassword("");
        setStoreId("");
      } else {
        Alert.alert("Error", data.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding the user. Please try again."
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
          Add a New User
        </Text>
      </View>

      <View
        style={[
          styles.formContainer,
          { backgroundColor: isDarkMode ? "#374151" : "#FFFFFF" },
        ]}
      >
        <TextInput
          placeholder="Name"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Picker for selecting store */}
        <Picker
          selectedValue={storeId}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
          ]}
          onValueChange={(itemValue) => setStoreId(itemValue)}
        >
          <Picker.Item label="Select a store" value="" />
          {stores.map((store) => (
            <Picker.Item key={store.id} label={store.name} value={store.id} />
          ))}
        </Picker>

        <TouchableOpacity
          onPress={handleAddUser}
          style={[
            styles.saveButton,
            { backgroundColor: isDarkMode ? "#10B981" : "#22C55E" },
          ]}
        >
          <Text style={styles.saveButtonText}>Add User</Text>
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

export default AddUserScreen;
