import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

import Chat from "../navigation/chat";
import Home from "../navigation/home";
import Wallet from "../navigation/wallet";


import ProfileHome from "../navigation/profile";
import EmergencyContact from "../navigation/profile-pages/EmergencyContact";
import HelpCenter from "../navigation/profile-pages/HelpCenter";
import ManageAddress from "../navigation/profile-pages/ManageAddress";
import Notification from "../navigation/profile-pages/Notification";
import PaymentMethods from "../navigation/profile-pages/PaymentMethods";
import PreBookedRides from "../navigation/profile-pages/PreBookedRides";
import Settings from "../navigation/profile-pages/Settings";
import YourProfile from "../navigation/profile-pages/YourProfile";

import RideStart from "../navigation/booking";
import RideBooking from "../navigation/RideBooking";

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RideStack = createNativeStackNavigator();

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH * 0.9;

const TabIcon = ({ iconLibrary, name, label, focused }) => {
  const IconComponent = iconLibrary === "material" ? MaterialIcons : Ionicons;

  return (
    <View className="items-center justify-center w-[70px]">
      <View
        className={`w-[55px] h-[55px] rounded-full items-center justify-center mb-[-2px] ${
          focused ? "bg-amber-500" : "bg-white"
        }`}
      >
        <IconComponent name={name} size={24} color={focused ? "#fff" : "#757575"} />
      </View>
      <Text
        className={`text-[14px] text-center ${
          focused ? "text-amber-500 font-semibold" : "text-gray-500 font-normal"
        }`}
      >
        {label}
      </Text>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{ width: TAB_WIDTH }}
      className="absolute bottom-8 self-center flex-row justify-around bg-white h-[100px] rounded-full items-center shadow-lg"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        let iconName = "";
        let iconLibrary = "ion";

        switch (route.name) {
          case "Home":
            iconName = isFocused ? "home" : "home-outline";
            break;
          case "Wallet":
            iconName = isFocused ? "wallet" : "wallet-outline";
            break;
          case "Bookings":
            iconName = "calendar-outline";
            break;
          case "Chat":
            iconName = isFocused ? "chatbubble" : "chatbubble-outline";
            break;
          case "ProfileStack":
            iconName = isFocused ? "person" : "person-outline";
            break;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={index} onPress={onPress} activeOpacity={0.7}>
            <TabIcon iconLibrary={iconLibrary} name={iconName} label={label} focused={isFocused} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ✅ Profile stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="YourProfile" component={YourProfile} />
      <Stack.Screen name="ManageAddress" component={ManageAddress} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="PreBookedRides" component={PreBookedRides} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContact} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
    </Stack.Navigator>
  );
}

// ✅ Booking stack
function RideBookingStackScreen() {
  return (
    <RideStack.Navigator screenOptions={{ headerShown: false }}>
      <RideStack.Screen name="RideStart" component={RideStart} />
      <RideStack.Screen name="RideBooking" component={RideBooking} />
    </RideStack.Navigator>
  );
}

// ✅ Tabs
export default function BottomTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Wallet" component={Wallet} />
      <Tabs.Screen name="Bookings" component={RideBookingStackScreen} />
      <Tabs.Screen name="Chat" component={Chat} />
      <Tabs.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tabs.Navigator>
  );
}
