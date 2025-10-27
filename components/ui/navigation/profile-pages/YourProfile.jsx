import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BASE_URL from "../../../baseURl";

export default function ProfileScreen() {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Invalid JSON:", text);
        Alert.alert("Error", "Server did not return valid data.");
        return;
      }

      if (res.ok && data.user) {
        setUser(data.user);
        setFullName(data.user.fullName || "");
        setPhoneNumber(data.user.phoneNumber || "");
        setEmail(data.user.email || "");
        setGender(data.user.gender || "");
        setImage(data.user.image || "https://i.pravatar.cc/300");
      } else {
        Alert.alert("Error", data.message || "Failed to load user profile");
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      Alert.alert("Error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission denied");

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!email) return Alert.alert("Error", "No email found");

      const res = await fetch(`${BASE_URL}/users/updateProfileByEmail/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName, phoneNumber, image, gender }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Invalid JSON on save:", text);
        Alert.alert("Error", "Invalid response from server");
        return;
      }

      if (res.ok && data.success) {
        Alert.alert("Success", "Profile updated successfully!");
        setUser(data.user);
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }} className="bg-white">
      <View className="py-10 mb-4">
        <Text className="text-lg font-semibold text-gray-800">Your Profile</Text>
      </View>

      <View className="relative mb-8">
        <Image source={{ uri: image }} className="w-36 h-36 rounded-full" />
        <TouchableOpacity
          onPress={pickImage}
          className="absolute bottom-2 right-4 bg-amber-500 p-2.5 rounded-full shadow-md"
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="w-[90%] space-y-5">
        <View>
          <Text className="text-gray-700 mb-1 text-base">Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-1 text-base">Phone Number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              className="flex-1 py-3 text-base"
            />
            <TouchableOpacity>
              <Text className="text-amber-500 font-medium">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 mb-1 text-base">Email</Text>
          <TextInput
            value={email}
            editable={false}
            placeholder="example@gmail.com"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-100 text-gray-500"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-1 text-base">Gender</Text>
          <View className="border border-gray-300 rounded-xl">
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={{ color: gender ? "black" : "#9ca3af" }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleSave} className="mt-10 w-[90%] bg-amber-500 py-4 rounded-full">
        <Text className="text-white text-lg font-medium text-center">Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
