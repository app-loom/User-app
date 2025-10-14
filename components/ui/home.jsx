import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [MapViewComp, setMapViewComp] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      import("react-native-maps").then((maps) => {
        setMapViewComp(() => maps.default);
      });
    }
  }, []);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (!location) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fetching Location...</Text>
      </SafeAreaView>
    );
  }

  const MapView = MapViewComp;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />

      {Platform.OS !== "web" && MapView ? (
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          customMapStyle={detailedMapStyle}
          showsUserLocation={true}
          followsUserLocation={true}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Map not supported on web</Text>
        </View>
      )}

      {/* Top search bar */}
      <View
        style={{
          position: "absolute",
          width: `70%`,
          top: 60,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 30,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Ionicons name="location-outline" size={18} color="#f59e0b" />
        <Text style={{ marginLeft: 100, fontWeight: "600", color: "#374151" }}>
          Current Location
        </Text>
        <Ionicons name="search-outline" size={18} color="#374151" style={{ marginLeft: 90 }} />
      </View>

      {/* Destination & Office Cards */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
          alignSelf: "center",
          width: "90%",
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ color: "#111827", fontSize: 16, fontWeight: "600" }}>Where to?</Text>
          <TouchableOpacity>
            <Text style={{ color: "#f59e0b", fontWeight: "700" }}>MANAGE</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#f59e0b",
              borderRadius: 16,
              paddingVertical: 20,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="location-outline" size={24} color="#fff" />
            <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600" }}>Destination</Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>Enter Destination</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#111827",
              borderRadius: 16,
              paddingVertical: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="business-outline" size={24} color="#fff" />
            <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600" }}>Office</Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>35 Km Away</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          paddingVertical: 14,
          borderRadius: 40,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#f59e0b" />
          <Text style={{ color: "#f59e0b", fontSize: 10 }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate("Wallet")}>
          <Ionicons name="wallet-outline" size={24} color="#9ca3af" />
          <Text style={{ color: "#9ca3af", fontSize: 10 }}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate("Bookings")}>
          <Ionicons name="calendar-outline" size={24} color="#9ca3af" />
          <Text style={{ color: "#9ca3af", fontSize: 10 }}>Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubble-outline" size={24} color="#9ca3af" />
          <Text style={{ color: "#9ca3af", fontSize: 10 }}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color="#9ca3af" />
          <Text style={{ color: "#9ca3af", fontSize: 10 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const detailedMapStyle = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "on" }] },
  { featureType: "poi.business", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "poi.park", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "transit", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
];
