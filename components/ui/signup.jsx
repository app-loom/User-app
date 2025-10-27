import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import BASE_URL from "../baseURl.jsx";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim()) return Toast.show({ type: "error", text1: "Full Name required" });
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return Toast.show({ type: "error", text1: "Invalid Email" });
    if (!password || password.length < 4) return Toast.show({ type: "error", text1: "Password too short" });
    if (!agree) return Toast.show({ type: "error", text1: "Agree to Terms & Conditions" });

    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}/users/signup`, {
        fullName,
        email,
        password,
      });

      if (res.data.success) {
        await AsyncStorage.setItem("token", res.data.token);
        Toast.show({ type: "success", text1: "Signup Successful" });
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.response?.data?.message || "Server error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingVertical: 40 }}>
        <Text className="text-3xl font-bold mb-4 text-center">Create Account</Text>
        <Text className="text-gray-500 mb-8 text-center">Fill your information below</Text>

        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Full Name</Text>
          <TextInput placeholder="Enter your full name" placeholderTextColor="#9ca3af" value={fullName} onChangeText={setFullName} className="border border-gray-300 rounded-lg p-3 w-full" />
        </View>

        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
          <TextInput placeholder="Enter your email" placeholderTextColor="#9ca3af" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" className="border border-gray-300 rounded-lg p-3 w-full" />
        </View>

        <View className="w-full mb-4 relative">
          <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
          <View className="flex-row border border-gray-300 rounded-lg items-center px-3">
            <TextInput placeholder="Enter your password" placeholderTextColor="#9ca3af" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} className="flex-1 py-3" />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setAgree(!agree)} className="flex-row mb-6 items-start self-start py-4">
          <View className={`w-5 h-5 mr-2 border rounded items-center justify-center ${agree ? "bg-amber-500 border-amber-500" : "border-gray-400"}`}>{agree && <Ionicons name="checkmark" size={16} color="white" />}</View>
          <Text>
            Agree with <Text className="text-amber-500 underline">Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUp} className="bg-amber-500 py-3 rounded-full mb-6 w-full" disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center font-bold text-lg">Sign Up</Text>}
        </TouchableOpacity>

        <Text className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Text className="text-amber-500 underline" onPress={() => navigation.navigate("Signin")}>
            Sign In
          </Text>
        </Text>

        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
}
