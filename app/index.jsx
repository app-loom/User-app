import GetStart from "@/components/ui/getstart";
import HomeScreen from "@/components/ui/home";
import Wallet from "@/components/ui/navigation/wallet";
import Otp from "@/components/ui/otp";
import SetupProfile from "@/components/ui/setupprofile";
import SignIn from "@/components/ui/signin";
import SignUp from "@/components/ui/signup";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";


import "./global.css";


const Stack = createNativeStackNavigator();

export default function Index() {
    

  return (
      <Stack.Navigator initialRouteName="GetStart" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="GetStart" component={GetStart} />
              <Stack.Screen name="Signup" component={SignUp} />
              <Stack.Screen name="Otp" component={Otp} />
              <Stack.Screen name="SetupProfile" component={SetupProfile} />
              <Stack.Screen name="Signin" component={SignIn} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Wallet" component={Wallet} />
      </Stack.Navigator>
  );
}


