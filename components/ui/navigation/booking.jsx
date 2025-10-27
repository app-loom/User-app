import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BASE_URL from "../../baseURl.jsx";

export default function BookingHistory() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found — redirecting to Login");
          navigation.navigate("Login");
          return;
        }

        const res = await fetch(`${BASE_URL}/rides/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Ride history response:", data);

        if (data.success && Array.isArray(data.rides)) {
          setHistory(data.rides);
        } else {
          console.warn("No rides found:", data.message);
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, [navigation]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-gray-600 mt-4">Loading your ride history...</Text>
      </View>
    );
  }

  if (!history.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-gray-600 text-lg mb-6">
          No ride history found.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("RideBooking")}
          className="bg-amber-500 p-4 rounded-full w-64"
        >
          <Text className="text-white text-center font-bold">
            Book a New Ride
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-20">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
        Ride History
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 140,
        }}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 mb-3 rounded-xl shadow-sm">
            <Text className="font-bold text-lg mb-1 text-gray-900">
              Ride ID: {item.rideId}
            </Text>
            <Text className="text-gray-700">
              From: {item.origin?.latitude?.toFixed(4)},{" "}
              {item.origin?.longitude?.toFixed(4)}
            </Text>
            <Text className="text-gray-700">
              To: {item.destination?.latitude?.toFixed(4)},{" "}
              {item.destination?.longitude?.toFixed(4)}
            </Text>
            <Text className="text-gray-700">
              Distance: {item.distance_km?.toFixed(2)} km
            </Text>
            <Text className="text-gray-700">Fare: ₹{item.price}</Text>
            <Text className="text-gray-700">Driver: {item.driverName}</Text>
            <Text
              className={`font-semibold ${
                item.status === "completed"
                  ? "text-green-600"
                  : item.status === "cancelled"
                  ? "text-red-500"
                  : "text-amber-600"
              }`}
            >
              Status: {item.status}
            </Text>
            <Text className="text-gray-500 mt-1 text-sm">
              Date: {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />

      <View className="absolute bottom-48 left-0 right-0 flex items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("RideBooking")}
          className="bg-amber-500 p-5 rounded-full w-[80%]"
        >
          <Text className="text-white text-center font-bold">
            Book a New Ride
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
