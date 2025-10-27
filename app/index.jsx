import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import GetStart from "@/components/ui/getstart";
import Otp from "@/components/ui/otp";
import SetupProfile from "@/components/ui/setupprofile";
import SignIn from "@/components/ui/signin";
import SignUp from "@/components/ui/signup";
import BottomTabs from "@/components/ui/tabs/DashboardTabs";

import "./global.css";

const Stack = createNativeStackNavigator();

export default function Index() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
        
          setInitialRoute("Home");
        } else {
      
          setInitialRoute("GetStart");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setInitialRoute("GetStart");
      }
    };

    checkUserStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStart" component={GetStart} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="SetupProfile" component={SetupProfile} />
      <Stack.Screen name="Signin" component={SignIn} />
      <Stack.Screen name="Home" component={BottomTabs} />
    </Stack.Navigator>
  );
}
