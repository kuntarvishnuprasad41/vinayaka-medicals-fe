import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';

const ProfileScreen = () => {
  const [role, setRole] = useState('Admin'); // Default role is Admin, change as needed
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleEditProfile = () => {
    // Handle edit profile action
  };

  const handleLogout = () => {
    // Handle logout action
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-600 to-blue-400'} px-8 py-12`}>
      <View className="items-center mb-8">
        <Image
          source={{ uri: 'https://your-profile-pic-url.com/pic.png' }} // Replace with your profile picture
          className="w-32 h-32 rounded-full mb-4 border-4 border-indigo-500"
        />
        <View className="flex-row items-center">
          <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>John Doe</Text>
          <View className={`ml-2 px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-600'}`}>
            <Text className="text-white text-xs font-semibold">{role}</Text>
          </View>
        </View>
        <Text className={`text-lg mt-2 ${isDarkMode ? 'text-gray-300' : 'text-white'}`}>johndoe@example.com</Text>
      </View>

      <View className={`rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Profile Information</Text>
        <View className="mt-4">
          <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone: +123 456 7890</Text>
          <Text className={`text-base mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address: 123 Main Street, City, Country</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleEditProfile} className={`py-3 rounded-lg mb-4 shadow-md ${isDarkMode ? 'bg-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
        <Text className="text-white text-center font-semibold text-lg">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} className={`py-3 rounded-lg shadow-md ${isDarkMode ? 'bg-red-600' : 'bg-red-500'}`}>
        <Text className="text-white text-center font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
