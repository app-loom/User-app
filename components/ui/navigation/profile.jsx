import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BASE_URL from "../../baseURl.jsx";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setFullName(data.user.fullName || "");
        setImage(data.user.image || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            navigation.reset({
              index: 0,
              routes: [{ name: "Signin" }],
            });
          },
        },
      ]
    );
  };

  const menu = [
    { title: "Your profile", icon: "person-outline", screen: "YourProfile" },
    { title: "Manage Address", icon: "location-outline", screen: "ManageAddress" },
    { title: "Notification", icon: "notifications-outline", screen: "Notification" },
    { title: "Payment Methods", icon: "card-outline", screen: "PaymentMethods" },
    { title: "Pre-Booked Rides", icon: "calendar-outline", screen: "PreBookedRides" },
    { title: "Settings", icon: "settings-outline", screen: "Settings" },
    { title: "Emergency Contact", icon: "call-outline", screen: "EmergencyContact" },
    { title: "Help Center", icon: "help-circle-outline", screen: "HelpCenter" },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingTop: 80, paddingBottom: 40 }}
      className="bg-white"
    >
      <Text className="text-2xl font-semibold text-gray-900 mb-10">Profile</Text>

      <View className="relative items-center mb-6">
        <Image
          source={{
            uri:
              image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYOvDs-ry3nz6dC7R-Ut7z78f98QnTkD4bTsWCXman027r53vIrXhiMS7hJ6tUyMjb6mE&usqp=CAU",
          }}
          className="w-36 h-36 rounded-full"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <View className="items-center mb-6">
          <Text className="text-lg font-semibold text-center">{fullName || "No Name"}</Text>
        </View>
      )}

      <View className="w-full">
        {menu.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            activeOpacity={0.6}
            className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon} size={22} color="#f59e0b" />
              <Text className="ml-3 text-[15px] text-gray-800">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.6}
          className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200"
        >
           <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={22} color="#f59e0b" />
          <Text className="ml-3 text-[15px] text-gray-800">Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
