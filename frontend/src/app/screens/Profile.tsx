import { loginStatusState } from "@/store/loginAtom";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useColorScheme } from "react-native";
import { useRecoilState } from "recoil";
import { getUser, setLogout } from "../(tabs)/_layout";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [_, setLogin] = useRecoilState(loginStatusState);
  const [user, setUser] = useState();
  const router = useRouter();

  const handleEditProfile = () => {
    // Handle edit profile action
  };

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
