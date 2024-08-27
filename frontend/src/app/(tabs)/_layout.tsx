import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile";
import PaymentEntryScreen from "../screens/PaymentEntry";
import StoreCreationScreen from "../screens/StoreCreationScreen";
import AddUserScreen from "../screens/AddUser";
import PaymentsScreen from "../screens/PaymentsScreen";
import { useRecoilState } from "recoil";
import { loginStatusState } from "../../store/loginAtom";
import LoginScreen from "../screens/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Home"
      component={PaymentEntryScreen}
      options={{ title: " Home", headerShown: false }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: "Profile", headerShown: false }}
    />
    <Stack.Screen
      name="CreateStore"
      component={StoreCreationScreen}
      options={{ title: "CreateStore", headerShown: false }}
    />
    <Stack.Screen
      name="AddUserScreen"
      component={AddUserScreen}
      options={{ title: "AddUserScreen", headerShown: false }}
    />
    <Stack.Screen
      name="PaymentsScreen"
      component={PaymentsScreen}
      options={{ title: "PaymentsScreen", headerShown: false }}
    />
  </Stack.Navigator>
);

export default function TabLayout() {
  const [loggedIn, setLoggedIn] = useRecoilState(loginStatusState);

  if (!loggedIn) {
    return <LoginScreen />;
  }

  // Initialize the auth state from AsyncStorage

  // Initialize the auth state from AsyncStorage

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomePage") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog";
          }

          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#42a5f5",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#000",
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomePage"
        component={HomeStack}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
}

export const setLogin = async (token, user, setLoggedIn) => {
  await AsyncStorage.setItem("authToken", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));

  // Update the Recoil state to reflect the logged-in status
  setLoggedIn(true);
};

export const setLogout = async (setLoggedIn) => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("user");

  // Update the Recoil state to reflect the logged-in status
  setLoggedIn(false);
};

export const getUser = async () => {
  return await AsyncStorage.getItem("user");
};