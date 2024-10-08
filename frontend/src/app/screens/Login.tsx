import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useColorScheme } from "react-native";
import { useRecoilState } from "recoil";
import { loginStatusState } from "../../store/loginAtom";
import { BASE_URL } from "@/utils/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLogin = async (token, user, setLoggedIn) => {
  await AsyncStorage.setItem("authToken", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));

  // Update the Recoil state to reflect the logged-in status
  setLoggedIn(true);
};

const LoginScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setLoggedIn] = useRecoilState(loginStatusState);

  const handleLogin = async () => {
    try {
      const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      });

      console.log(response);

      const data = await response.json();

      console.log("data");

      if (response.ok) {
        // Assuming the response contains the token and user info
        const { token, user } = data;

        setLogin(token, user, setLoggedIn);

        // Store the token in secure storage (AsyncStorage or SecureStore)

        // Optionally, navigate to another screen, e.g., Profile
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    }
  };

  const handleCall = () => {
    const phoneNumber = "tel:+919986084580";
    Linking.openURL(phoneNumber);
  };

  return (
    <View
      className={`flex-1 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-b from-blue-600 to-blue-400"
      } justify-center px-8`}
    >
      <View className="items-center mb-8">
        <Image
          source={{ uri: "https://your-logo-url.com/logo.png" }} // Replace with your logo
          className="w-24 h-24 mb-4"
        />
        <Text
          className={`text-4xl font-bold ${
            isDarkMode ? "text-white" : "text-blue-900"
          }`}
        >
          Vinayaka Medicals
        </Text>
        <Text className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-white"}`}>
          Login to continue
        </Text>
      </View>

      <View
        className={`rounded-2xl shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor={isDarkMode ? "#cccccc" : "#999999"}
          className={`px-4 py-3 rounded-lg mb-4 border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-black"
          }`}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={isDarkMode ? "#cccccc" : "#999999"}
          className={`px-4 py-3 rounded-lg mb-6 border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-black"
          }`}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          className={`py-3 rounded-lg mb-4 shadow-md ${
            isDarkMode
              ? "bg-purple-600"
              : "bg-gradient-to-r from-indigo-500 to-purple-600"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCall} className="mt-4">
          <Text
            className={`text-center ${
              isDarkMode ? "text-purple-400" : "text-purple-700"
            }`}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleCall} className="mt-8">
        <Text
          className={`text-center ${
            isDarkMode ? "text-gray-300" : "text-white"
          }`}
        >
          Don't have an account? Request for{" "}
          <Text className="font-semibold underline">Id</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
