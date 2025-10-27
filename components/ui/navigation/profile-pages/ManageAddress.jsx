import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import BASE_URL from "../../../baseURl.jsx";

const detailedMapStyle = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
];

export default function AddAddressScreen() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [state, setState] = useState(""); // floor
  const [postalCode, setPostalCode] = useState(""); // landmark
  const [region, setRegion] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();

    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/users/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setSavedAddress(res.data.address);
    } catch (err) {
      console.error("Fetch Address Error:", err);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Error", "User not authenticated");

      const res = await axios.post(
        `${BASE_URL}/users/address/add`,
        { label: selectedLabel, address: street, floor: state, landmark: postalCode, location: region },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Alert.alert("Success", "Address added successfully");
        setShowAddForm(false);
        fetchAddress();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save address");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-900 mb-6">My Address</Text>

      {savedAddress && savedAddress.isActive && (
        <View className="mb-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <Text className="font-semibold text-gray-700 mb-1">{savedAddress.label}</Text>
          <Text className="text-gray-600">{savedAddress.street}</Text>
          {savedAddress.state ? <Text className="text-gray-600">Floor: {savedAddress.state}</Text> : null}
          {savedAddress.postalCode ? <Text className="text-gray-600">Landmark: {savedAddress.postalCode}</Text> : null}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowAddForm(true)}
        className="border border-dashed border-orange-400 rounded-2xl px-6 py-4 flex-row items-center justify-center bg-orange-50 w-4/5"
      >
        <Ionicons name="add-circle-outline" size={24} color="#f97316" />
        <Text className="text-orange-500 font-semibold text-base ml-2">Add New Address</Text>
      </TouchableOpacity>

      <Modal visible={showAddForm} animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowAddForm(false)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold ml-3">Add Address</Text>
          </View>

          <View className="h-64 w-full">
            {region ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                region={region}
                onRegionChangeComplete={setRegion}
                customMapStyle={detailedMapStyle}
              >
                <Marker coordinate={region}>
                  <Ionicons name="location" size={40} color="orange" />
                </Marker>
              </MapView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">Loading map...</Text>
              </View>
            )}
          </View>

          <ScrollView className="flex-1 px-5 py-4">
            <Text className="text-gray-600 font-semibold mb-2">Save address as</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {["Home", "Office", "Parents House", "Friends House"].map((label) => (
                <TouchableOpacity
                  key={label}
                  className={`px-4 py-2 rounded-full border ${
                    selectedLabel === label ? "bg-orange-500 border-orange-500" : "border-gray-300"
                  }`}
                  onPress={() => setSelectedLabel(label)}
                >
                  <Text className={`${selectedLabel === label ? "text-white" : "text-gray-700"} text-sm font-medium`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-600 mb-1">Complete address *</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Enter full address"
                  value={street}
                  onChangeText={setStreet}
                />
              </View>

              <View>
                <Text className="text-gray-600 mb-1">Floor</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Enter floor"
                  value={state}
                  onChangeText={setState}
                />
              </View>

              <View>
                <Text className="text-gray-600 mb-1">Landmark</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Nearby landmark"
                  value={postalCode}
                  onChangeText={setPostalCode}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSaveAddress} className="mt-6 bg-orange-500 rounded-full py-3">
              <Text className="text-white text-center font-semibold text-base">Save Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
  