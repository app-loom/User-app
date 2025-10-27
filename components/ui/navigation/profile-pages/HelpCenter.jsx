import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("FAQ");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState({});

  const categories = ["All", "Services", "General", "Account"];

  const faqs = [
    {
      question: "What if I need to cancel a booking?",
      answer:
        "You can cancel any ride from the 'My Bookings' section. Some cancellation charges may apply depending on the time of cancellation.",
      category: "All",
    },
    {
      question: "Is it safe to use the app?",
      answer:
        "Yes. All our drivers are verified and rides are tracked in real-time. You can share your trip status with your family for extra safety.",
      category: "General",
    },
    {
      question: "How do I receive booking details?",
      answer:
        "Once your ride is confirmed, booking details are shared via app notification, SMS, and email.",
      category: "Account",
    },
    {
      question: "How can I edit my profile information?",
      answer:
        "Go to Profile > Edit and update your name, phone number, or other details easily.",
      category: "Account",
    },
    {
      question: "How to cancel a taxi?",
      answer:
        "Open 'My Bookings', select your upcoming ride, and tap 'Cancel Booking'.",
      category: "Services",
    },
    {
      question: "Is there a voice call or chat feature?",
      answer:
        "Yes. You can directly call or chat with your driver after your ride is confirmed.",
      category: "Services",
    },
    {
      question: "How can I see my pre-booked taxi?",
      answer:
        "Go to the 'My Bookings' tab in the app to view all upcoming and past bookings.",
      category: "Services",
    },
    {
      question: "I forgot my password. How do I reset it?",
      answer:
        "Tap 'Forgot Password' on the login screen and follow the steps sent to your registered email or phone number.",
      category: "Account",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-24">
  
      <TouchableOpacity className="flex-row items-center mb-4">
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="ml-2 text-lg font-semibold">Help Center</Text>
      </TouchableOpacity>

    
      <View className="flex-row mb-3 border-b border-gray-200">
        {["FAQ", "Contact Us"].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`px-4 py-2 ${
              activeMainTab === tab
                ? "border-b-2 border-amber-400"
                : "border-b-2 border-transparent"
            }`}
            onPress={() => setActiveMainTab(tab)}
          >
            <Text
              className={`font-medium ${
                activeMainTab === tab ? "text-amber-500" : "text-gray-600"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeMainTab === "FAQ" && (
        <>
          {/* Search */}
          <View className="mb-4 flex-row items-center border border-gray-300 rounded-lg px-3">
            <Ionicons name="search-outline" size={18} color="gray" />
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-2 py-2 text-gray-700"
            />
          </View>

          <View className="flex-row mb-4 space-x-2">
            {categories.map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`px-4 py-2 rounded-full border ${
                  activeCategory === tab
                    ? "bg-amber-400 border-amber-400"
                    : "border-gray-300"
                }`}
                onPress={() => setActiveCategory(tab)}
              >
                <Text
                  className={`font-medium ${
                    activeCategory === tab ? "text-white" : "text-gray-700"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

         
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredFaqs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleExpand(index)}
                className="border-b border-gray-200 py-3"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 font-medium">
                    {item.question}
                  </Text>
                  <Ionicons
                    name={expandedItems[index] ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="gray"
                  />
                </View>
                {expandedItems[index] && (
                  <Text className="text-gray-600 mt-2 leading-5">
                    {item.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

     
      {activeMainTab === "Contact Us" && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-semibold text-gray-800 mt-2 mb-2">
            Get in Touch
          </Text>
          <Text className="text-gray-600 mb-4">
            Need help or have a question? Our team is here for you 24/7.
          </Text>

          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3"
            onPress={() => openLink("mailto:support@rideapp.com")}
          >
            <Ionicons name="mail-outline" size={22} color="black" />
            <Text className="ml-3 text-gray-800">
              Email: support@rideapp.com
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3"
            onPress={() => openLink("tel:+91800123456")}
          >
            <Ionicons name="call-outline" size={22} color="black" />
            <Text className="ml-3 text-gray-800">Call: +1 800 123 456</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3"
            onPress={() => openLink("")}
          >
            <Ionicons name="chatbubbles-outline" size={22} color="black" />
            <Text className="ml-3 text-gray-800">Live Chat Support</Text>
          </TouchableOpacity>

          <View className="border-t border-gray-200 mt-4 pt-4">
            <Text className="text-sm text-gray-600">
              Our customer support is available 24/7 for booking, safety, and
              payment-related help.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
