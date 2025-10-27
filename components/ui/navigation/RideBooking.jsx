import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import BASE_URL from "../../baseURl.jsx";

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 🔑 Replace with your actual key

export default function RideBooking({ route }) {
  const navigation = useNavigation();
  const { userEmail, token: routeToken } = route.params || {};

  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [routeCoords, setRouteCoords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    getLiveLocation();
  }, []);

  // ✅ Get Current Location
  const getLiveLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is required.");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setLoading(false);
  };

  // ✅ Get Directions from Google API
  const fetchRoute = async (origin, destination) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes.length) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoords(points);
      }
    } catch (error) {
      console.log("Directions API error:", error);
    }
  };

  // ✅ Decode Google Polyline (route)
  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  // ✅ Calculate Distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ✅ Fetch Google Places
  const fetchPlaces = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&region=in&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.log("Places API error:", err);
      setSearchResults([]);
    }
  };

  // ✅ When User Selects a Place
  const onPlaceSelect = (place) => {
    const { lat, lng } = place.geometry.location;
    const dest = { latitude: lat, longitude: lng };
    setDestination(dest);
    const km = getDistance(region.latitude, region.longitude, lat, lng);
    setDistance(km);
    fetchRoute(region, dest);
    mapRef.current?.fitToCoordinates([region, dest], {
      edgePadding: { top: 100, bottom: 50, left: 50, right: 50 },
      animated: true,
    });
    setSearchQuery(place.name);
    setSearchResults([]);
  };

  // ✅ When User Clicks on Map
  const handleMapPress = (e) => {
    const dest = e.nativeEvent.coordinate;
    setDestination(dest);
    const km = getDistance(region.latitude, region.longitude, dest.latitude, dest.longitude);
    setDistance(km);
    fetchRoute(region, dest);
  };

  // ✅ Book Ride
  const bookRide = async () => {
    if (!destination) {
      Alert.alert("Select destination first!");
      return;
    }

    try {
      const token = routeToken || (await AsyncStorage.getItem("token"));
      if (!token) {
        Alert.alert("Login required", "Please login before booking a ride.");
        return;
      }

      const res = await fetch(`${BASE_URL}/rides/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin: region,
          destination,
          distance_km: distance,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Invalid JSON response:", text);
        Alert.alert("Server Error", "Invalid response from server.");
        return;
      }

      if (!res.ok) {
        Alert.alert("Error", data.message || "Unable to book ride.");
        return;
      }

      Alert.alert("✅ Ride Booked!", `Your ride to ${searchQuery} is confirmed.`);
      navigation.navigate("RideStart", { ride: data.ride });
    } catch (err) {
      console.log("Booking error:", err);
      Alert.alert("Error", "Something went wrong while booking the ride.");
    }
  };

  const fare = Math.round(distance * 12);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 🗺️ MAP SECTION */}
      <View style={{ flex: 0.8 }}>
        {region && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation
            onPress={handleMapPress}
          >
            {destination && (
              <>
                <Marker coordinate={destination} pinColor="orange" title="Destination" />
                {routeCoords.length > 0 && (
                  <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#f59e0b" />
                )}
              </>
            )}
          </MapView>
        )}

        {/* 🚗 Floating Box */}
        {destination && (
          <View
            style={{
              position: "absolute",
              top: 40,
              left: 20,
              right: 20,
              backgroundColor: "white",
              padding: 12,
              borderRadius: 15,
              elevation: 6,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>🚘 Ride Summary</Text>
            <Text style={{ color: "#555" }}>Distance: {distance.toFixed(2)} km</Text>
            <Text style={{ fontWeight: "600", color: "#000" }}>Fare: ₹{fare}</Text>
          </View>
        )}
      </View>

      {/* 📍 DETAILS SECTION */}
      <View
        style={{
          flex: 0.4,
          backgroundColor: "#fff",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          elevation: 8,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            placeholder="Enter destination..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchPlaces(text);
            }}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 10,
              marginBottom: 5,
            }}
          />

          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_id}
              style={{
                maxHeight: 150,
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: 5,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onPlaceSelect(item)}
                  style={{ padding: 10, borderBottomWidth: 1, borderColor: "#eee" }}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <Text style={{ color: "#555", fontSize: 12 }}>{item.formatted_address}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            onPress={bookRide}
            style={{
              backgroundColor: "#f59e0b",
              padding: 15,
              borderRadius: 25,
              marginTop: 15,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
              Confirm Ride
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{
              backgroundColor: "#e5e7eb",
              padding: 15,
              borderRadius: 25,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "black", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
