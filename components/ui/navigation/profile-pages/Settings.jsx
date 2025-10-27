import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import BASE_URL from "../../../baseURl.jsx";

export default function SettingsScreen({ navigation }) {
  const [activeScreen, setActiveScreen] = useState(null);

  const [delEmail, setDelEmail] = useState("");
  const [delPassword, setDelPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const settingsOptions = [
    {
      id: 1,
      title: "Notification Settings",
      icon: <Ionicons name="notifications-outline" size={22} color="#b8860b" />,
      screen: "notifications",
    },
    {
      id: 2,
      title: "Password Manager",
      icon: <Ionicons name="key-outline" size={22} color="#b8860b" />,
      screen: "password",
    },
    {
      id: 3,
      title: "Delete Account",
      icon: <MaterialIcons name="delete-outline" size={22} color="#b8860b" />,
      screen: "delete",
    },
  ];
const handleDeleteAccount = async () => {
  if (!delEmail.trim() || !delPassword.trim()) {
    return Toast.show({
      type: "error",
      text1: "Missing Fields",
      text2: "Please enter both Email and Password",
    });
  }

  try {
    setIsDeleting(true);

    const res = await axios.post(`${BASE_URL}users/delete`, {
      email: delEmail.toLowerCase(),
      password: delPassword,
    });

    if (res.data.success) {
      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been removed successfully.",
      });

    
      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "GetStart" }],
      });

   
      if (global?.ExpoUpdates) {
        global.ExpoUpdates.reloadAsync();
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: res.data.message || "Invalid email or password",
      });
    }
  } catch (err) {
    console.error("Delete Error:", err);
    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: err.response?.data?.message || "Unable to connect to server",
    });
  } finally {
    setIsDeleting(false);
  }
};

  const renderSubPage = () => {
    switch (activeScreen) {
      case "notifications":
        return (
          <View className="flex-1 p-5">
            <Text className="text-lg font-semibold mb-4">Notification Settings</Text>
            <Text>Here you can customize your notification preferences.</Text>
            <TouchableOpacity
              className="mt-5 px-4 py-2 bg-yellow-500 rounded"
              onPress={() => setActiveScreen(null)}
            >
              <Text className="text-white">Back to Settings</Text>
            </TouchableOpacity>
          </View>
        );
      case "password":
        return (
          <View className="flex-1 p-5">
            <Text className="text-lg font-semibold mb-4">Password Manager</Text>
            <Text>Change your password or manage saved passwords here.</Text>
            <TouchableOpacity
              className="mt-5 px-4 py-2 bg-yellow-500 rounded"
              onPress={() => setActiveScreen(null)}
            >
              <Text className="text-white">Back to Settings</Text>
            </TouchableOpacity>
          </View>
        );
      case "delete":
        return (
          <View className="flex-1 p-5">
            <Text className="text-lg font-semibold mb-4">Delete Account</Text>
            <Text className="text-gray-600 mb-4">
              Warning! Deleting your account is permanent. Please enter your credentials to confirm.
            </Text>

            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
              placeholder="example@gmail.com"
              value={delEmail}
              onChangeText={setDelEmail}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text className="text-gray-600 mb-2">Password</Text>
            <TextInput
              placeholder="********"
              value={delPassword}
              onChangeText={setDelPassword}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
              secureTextEntry
            />

            <TouchableOpacity
              className={`${isDeleting ? "bg-red-400" : "bg-red-500"} py-3 rounded-xl mt-4`}
              onPress={handleDeleteAccount}
              disabled={isDeleting}
            >
              <Text className="text-white text-center font-semibold">
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 py-2"
              onPress={() => setActiveScreen(null)}
            >
              <Text className="text-amber-500 text-center font-semibold">Back to Settings</Text>
            </TouchableOpacity>

            <Toast />
          </View>
        );
      default:
        return null;
    }
  };

  if (activeScreen) {
    return (
      <View className="flex-1 bg-white pt-20">
        <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
          <TouchableOpacity onPress={() => setActiveScreen(null)}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black ml-4">
            {settingsOptions.find((opt) => opt.screen === activeScreen)?.title}
          </Text>
        </View>
        <ScrollView>{renderSubPage()}</ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-20 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black ml-4">Settings</Text>
      </View>

      <View className="mt-2">
        {settingsOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 active:bg-gray-50"
            onPress={() => setActiveScreen(item.screen)}
          >
            <View className="flex-row items-center space-x-3">
              {item.icon}
              <Text className="text-base px-1 text-gray-800">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#b8860b" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
