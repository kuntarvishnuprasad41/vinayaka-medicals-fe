import { loginStatusState } from "@/store/loginAtom";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useColorScheme } from "react-native";
import { useRecoilState } from "recoil";
import { getUser, setLogout } from "../(tabs)/_layout";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import { BASE_URL } from "@/utils/BaseUrl";
import { getAuthToken } from "./PaymentsScreen";

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [_, setLogin] = useRecoilState(loginStatusState);
  const [user, setUser] = useState();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showAdminResetPassword, setShowAdminResetPassword] = useState(false);
  const router = useRouter();

  const userFromLocal = async () => {
    const storedUser = await getUser();
    return storedUser;
  };

  const handleLogout = () => {
    // Handle logout action
    setLogout(setLogin);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const u = await userFromLocal();
      setUser(JSON.parse(u));
    };

    fetchUser();
  }, []);

  const navigateToAddUser = () => {
    router.push("screens/AddUser"); // Navigate to AddUserScreen
  };

  const navigateToStoreCreation = () => {
    router.push("screens/StoreCreationScreen"); // Navigate to StoreCreationScreen
  };

  const paymentsList = () => {
    router.push("screens/PaymentsScreen");
  };

  return (
    <ScrollView
      className={`flex-1 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-b from-blue-600 to-blue-400"
      } px-8 py-12`}
    >
      <View className="items-center mb-8">
        <Image
          source={{ uri: "https://your-profile-pic-url.com/pic.png" }} // Replace with your profile picture
          className="w-32 h-32 rounded-full mb-4 border-4 border-indigo-500"
        />
        <View className="flex-row items-center">
          <Text
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-blue-900"
            }`}
          >
            {user?.name}
          </Text>
          <View
            className={`ml-2 px-2 py-1 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-indigo-600"
            }`}
          >
            <Text className="text-white text-xs font-semibold">
              {user?.role}
            </Text>
          </View>
        </View>
        <Text
          className={`text-lg mt-2 ${
            isDarkMode ? "text-gray-300" : "text-white"
          }`}
        >
          {user?.email}
        </Text>
      </View>

      {/* Conditionally render buttons if the user is an admin */}
      {user?.role === "ADMIN" && (
        <View className="mb-8">
          <TouchableOpacity
            onPress={navigateToAddUser}
            className={`py-3 mb-4 rounded-lg shadow-md ${
              isDarkMode ? "bg-blue-600" : "bg-indigo-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Add User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigateToStoreCreation}
            className={`py-3 mb-4 rounded-lg shadow-md ${
              isDarkMode ? "bg-green-600" : "bg-green-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Create Store
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={paymentsList}
            className={`px-2  py-3 rounded-lg shadow-md ${
              isDarkMode ? "bg-green-600" : "bg-green-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Payments List
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Button to toggle ResetPasswordComponent */}
      <TouchableOpacity
        onPress={() => setShowResetPassword(!showResetPassword)}
        className={`py-3 mb-4 rounded-lg shadow-md ${
          isDarkMode ? "bg-purple-600" : "bg-purple-500"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {showResetPassword ? "Hide" : "Reset Password"}
        </Text>
      </TouchableOpacity>
      {showResetPassword && <ResetPasswordComponent token={user} />}

      {/* Button to toggle AdminResetPasswordComponent */}
      {user?.role === "ADMIN" && (
        <>
          <TouchableOpacity
            onPress={() => setShowAdminResetPassword(!showAdminResetPassword)}
            className={`py-3 mb-4 rounded-lg shadow-md ${
              isDarkMode ? "bg-yellow-600" : "bg-yellow-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {showAdminResetPassword
                ? "Hide Admin Reset Password"
                : "Admin Reset Password"}
            </Text>
          </TouchableOpacity>
          {showAdminResetPassword && (
            <AdminResetPasswordComponent token={user} />
          )}
        </>
      )}

      <TouchableOpacity
        onPress={handleLogout}
        className={`py-3 rounded-lg shadow-md ${
          isDarkMode ? "bg-red-600" : "bg-red-500"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const ResetPasswordComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const token = await getAuthToken(); // Await the token promise

      const response = await fetch(BASE_URL + "/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the resolved token
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        Alert.alert("Success", "Password reset successful");
        setOldPassword("");
        setNewPassword("");
      } else {
        Alert.alert("Error", "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "An error occurred while resetting your password");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        className={`mb-4 px-4 py-3 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className={`mb-4 px-4 py-3 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      />
      <TouchableOpacity
        onPress={handleResetPassword}
        className={`py-3 rounded-lg shadow-md ${
          isDarkMode ? "bg-purple-600" : "bg-purple-500"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Reset Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminResetPasswordComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAdminResetPassword = async () => {
    try {
      const token = await getAuthToken(); // Await the token promise

      const response = await fetch(BASE_URL + "/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the resolved token
        },
        body: JSON.stringify({ email: email.toLowerCase(), newPassword }),
      });

      if (response.ok) {
        Alert.alert("Success", "User password reset successful");
        setEmail("");
        setNewPassword("");
      } else {
        Alert.alert("Error", "Failed to reset user's password");
      }
    } catch (error) {
      console.error("Error resetting user's password:", error);
      Alert.alert(
        "Error",
        "An error occurred while resetting the user's password"
      );
    }
  };

  return (
    <View>
      <TextInput
        placeholder="User Email"
        value={email}
        onChangeText={setEmail}
        className={`mb-4 px-4 py-3 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className={`mb-4 px-4 py-3 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        }`}
      />
      <TouchableOpacity
        onPress={handleAdminResetPassword}
        className={`py-3 rounded-lg shadow-md ${
          isDarkMode ? "bg-yellow-600" : "bg-yellow-500"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Admin Reset Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};
