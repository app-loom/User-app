"use client";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function GetStart({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="flex-1 justify-center items-center relative mt-6">
        <View className="absolute top-10 left-16 bg-white p-3 rounded-full shadow">
          <Icon name="location" size={20} color="#f59e0b" />
        </View>

        <View className="absolute top-24 right-16 bg-white p-3 rounded-full shadow">
          <Icon name="chatbubble-ellipses" size={20} color="#f59e0b" />
        </View>

        <View className="absolute top-44 left-20 bg-white p-3 rounded-full shadow">
          <Icon name="call" size={20} color="#f59e0b" />
        </View>

        <Image
          source={{
            src: "./assets/image/background.svg",
          }}
          className="w-80 h-80 rounded-full"
          resizeMode="cover"
        />
      </View>

      <View className="px-8 mt-6">
        <Text className="text-center text-xl font-semibold text-gray-900">Welcome to Your</Text>
        <Text className="text-center text-2xl font-bold text-amber-600 mt-1">Ultimate Transportation Solution</Text>
        <Text className="text-center text-gray-500 mt-3 text-base leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</Text>
      </View>

      <View className="px-8 mt-8 mb-10 w-full">
        <TouchableOpacity className="bg-amber-500 py-4 rounded-full shadow" onPress={() => navigation.navigate("Signup")}>
          <Text className="text-white text-center text-lg font-semibold">Let’s Get Started</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 text-base">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text className="text-amber-500 underline text-base">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
