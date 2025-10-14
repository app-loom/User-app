import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignUp = () => {
    if (!fullName.trim()) return Alert.alert("Validation Error", "Full Name is required");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return Alert.alert("Validation Error", "Valid Email is required");
    if (!password || password.length < 4) return Alert.alert("Validation Error", "Password must be at least 4 characters");
    // if (password !== confirmPassword) return Alert.alert("Validation Error", "Passwords do not match");
    if (!agree) return Alert.alert("Validation Error", "You must agree to Terms & Condition");

    navigation.navigate("Home", { email });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 40
        }}
      >
        <Text className="text-3xl font-bold mb-4 text-center">Create Account</Text>
        <Text className="text-gray-500 mb-8 text-center">
          Fill your information below or register with your social account.
        </Text>

     
        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#9ca3af"
            value={fullName}
            onChangeText={setFullName}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
        </View>

     
        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
        </View>

       
        <View className="relative w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9"
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

{/*         
        <View className="relative w-full mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Confirm Password</Text>
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
          <TouchableOpacity
            onPress={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9"
          >
            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View> */}
        
        
        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          className="flex-row items-center mb-6"
        >
          <View
            className={`w-5 h-5 mr-2 border rounded items-center justify-center ${
              agree ? "bg-amber-500 border-amber-500" : "border-gray-400"
            }`}
          >
            {agree && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text className="text-center">
            Agree with <Text className="text-amber-500 underline">Terms & Condition</Text>
          </Text>
        </TouchableOpacity>
      

       
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-amber-500 py-3 rounded-full mb-6 w-full"
        >
          <Text className="text-white text-center font-bold text-lg">Sign Up</Text>


        </TouchableOpacity>
          <View className="flex-row items-center mt-20">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="text-gray-500 mx-3 text-sm">Or signup with</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>

    
        <Text className="text-center text-gray-500">
          Already have an account?{" "}
          <Text
            className="text-amber-500 underline"
            onPress={() => navigation.navigate("Signin", { email })}
          >
            Sign In
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
