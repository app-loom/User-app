import React, { useState } from "react";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function SignIn({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-8 justify-center">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      
      <View className="items-center mt-16">
        <Text className="text-3xl font-bold text-gray-900">Sign In</Text>
        <Text className="text-center text-gray-500 mt-2 text-base">
          Hi! Welcome back, you've been missed 👋
        </Text>
      </View>

      <View className="mt-10">
        <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
        <TextInput
          placeholder="example@gmail.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />

        <View className="mt-5">
          <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
            <TextInput
              placeholder="********"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              className="flex-1 py-3 text-gray-900"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="mt-3 ml-auto">
          <Text className="text-amber-600 font-semibold text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      
      <TouchableOpacity
        className="bg-amber-500 py-4 rounded-full mt-10 shadow-lg active:bg-amber-600"
        onPress={() => navigation.navigate("Home")}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Sign In
        </Text>
      </TouchableOpacity>
        <View className="flex-row items-center mt-8">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="text-gray-500 mx-3 text-sm">Or sign in with</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

    
      <View className="flex-row justify-center mt-10">
        <Text className="text-gray-600 text-base">Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text className="text-amber-500 font-semibold underline text-base">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
