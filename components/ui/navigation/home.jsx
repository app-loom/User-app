//homepage 
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [MapViewComp, setMapViewComp] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      import("react-native-maps").then((maps) => setMapViewComp(() => maps.default));
    }
  }, []);

  useEffect(() => {
    let subscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 5000, distanceInterval: 1 },
        (loc) => setLocation(loc.coords)
      );
    })();
    return () => subscription && subscription.remove();
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
          showsUserLocation
          followsUserLocation
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Map not supported on web</Text>
        </View>
      )}
 
      <View
        style={{
          position: "absolute",
          top: 90,
          alignSelf: "center",
          width: "90%",
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 30,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Ionicons name="location-outline" size={18} color="#f59e0b" />
        <TextInput style={{ fontWeight: "600", color: "#374151" }}>Current Location</TextInput>
        <Ionicons name="search-outline" size={18} color="#374151" />
      </View>

  
      <View
        style={{
          position: "absolute",
          bottom: 150,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
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
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import * as Location from "expo-location";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import MapView, { Marker } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
// import { SafeAreaView } from "react-native-safe-area-context";
// import BASE_URL from "../../baseURl.jsx";

// const GOOGLE_MAPS_APIKEY = "YOUR_REAL_GOOGLE_MAPS_API_KEY";

// export default function Home() {
//   const [location, setLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [MapViewComp, setMapViewComp] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(true);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (Platform.OS !== "web") {
//       import("react-native-maps").then((maps) => setMapViewComp(() => maps.default));
//     } else {
//       setMapViewComp(() => MapView);
//     }
//   }, []);

//   useEffect(() => {
//     let subscription;
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access location was denied");
//         return;
//       }

//       subscription = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.Highest,
//           timeInterval: 5000,
//           distanceInterval: 1,
//         },
//         (loc) => {
//           setLocation(loc.coords);
//           setLoadingLocation(false);
//         }
//       );
//     })();

//     return () => subscription && subscription.remove();
//   }, []);

//   const handleConfirmRide = async () => {
//     if (!location || !destination) {
//       alert("Please select a destination first!");
//       return;
//     }

//     try {
//       const response = await axios.post(`${BASE_URL}/rides`, {
//         pickup: {
//           latitude: location.latitude,
//           longitude: location.longitude,
//         },
//         destination: {
//           latitude: destination.latitude,
//           longitude: destination.longitude,
//           name: destination.name,
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         alert("✅ Ride saved successfully!");
//       } else {
//         alert("⚠️ Unexpected response from server");
//       }
//     } catch (error) {
//       console.error("Ride save error:", error);
//       alert("❌ Failed to save ride. Check your backend connection.");
//     }
//   };

//   const handleDestinationClick = () => {
//     // Focus map on current location when opening destination search
//     if (mapRef.current && location) {
//       mapRef.current.animateToRegion({
//         latitude: location.latitude,
//         longitude: location.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       });
//     }
//     setShowSearch(true);
//   };

//   const MapViewEl = MapViewComp || MapView;

//   if (loadingLocation) {
//     return (
//       <SafeAreaView
//         style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}
//       >
//         <ActivityIndicator size="large" color="#f59e0b" />
//         <Text style={{ marginTop: 10, color: "#374151" }}>Fetching your location...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />

//       {/* MAP */}
//       {Platform.OS !== "web" && MapViewEl ? (
//         <MapViewEl
//           ref={mapRef}
//           style={{ flex: 1 }}
//           region={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//           customMapStyle={detailedMapStyle}
//           showsUserLocation
//           followsUserLocation
//         >
//           {/* Current Location Marker */}
//           {location && (
//             <Marker
//               coordinate={{
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//               }}
//               title="You are here"
//               pinColor="#f59e0b"
//             />
//           )}

//           {/* Destination Marker + Directions */}
//           {destination && (
//             <>
//               <Marker coordinate={destination} title="Destination" pinColor="black" />
//               <MapViewDirections
//                 origin={location}
//                 destination={destination}
//                 apikey={GOOGLE_MAPS_APIKEY}
//                 strokeWidth={4}
//                 strokeColor="#f59e0b"
//                 onReady={(result) => {
//                   if (mapRef.current && result.coordinates) {
//                     mapRef.current.fitToCoordinates(result.coordinates, {
//                       edgePadding: { top: 80, right: 50, bottom: 80, left: 50 },
//                     });
//                   }
//                 }}
//               />
//             </>
//           )}
//         </MapViewEl>
//       ) : (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <Text>🗺 Map not supported on Web Preview</Text>
//         </View>
//       )}

//       {/* Top current location bar */}
//       <View
//         style={{
//           position: "absolute",
//           top: 90,
//           alignSelf: "center",
//           width: "90%",
//           height: 60,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           backgroundColor: "#fff",
//           paddingVertical: 12,
//           paddingHorizontal: 16,
//           borderRadius: 30,
//           shadowColor: "#000",
//           shadowOpacity: 0.1,
//           shadowRadius: 5,
//           elevation: 5,
//         }}
//       >
//         <Ionicons name="navigate-outline" size={20} color="#f59e0b" />
//         <TextInput
//           editable={false}
//           value="Current Location"
//           style={{ fontWeight: "600", color: "#374151" }}
//         />
//         <TouchableOpacity onPress={handleDestinationClick}>
//           <Ionicons name="search-outline" size={22} color="#374151" />
//         </TouchableOpacity>
//       </View>

//       {/* Destination Search Bar */}
//       {showSearch && (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           style={{
//             position: "absolute",
//             top: 160,
//             alignSelf: "center",
//             width: "90%",
//             backgroundColor: "#fff",
//             borderRadius: 10,
//             padding: 8,
//             shadowColor: "#000",
//             shadowOpacity: 0.1,
//             shadowRadius: 6,
//             elevation: 5,
//           }}
//         >
//           <GooglePlacesAutocomplete
//             placeholder="Search Destination"
//             fetchDetails={true}
//             enablePoweredByContainer={false}
//             onPress={(data, details = null) => {
//               if (details?.geometry?.location) {
//                 const loc = details.geometry.location;
//                 setDestination({
//                   latitude: loc.lat,
//                   longitude: loc.lng,
//                   name: data.description,
//                 });
//                 setShowSearch(false);
//               } else {
//                 alert("Invalid destination. Try again.");
//               }
//             }}
//             query={{
//               key: GOOGLE_MAPS_APIKEY,
//               language: "en",
//               components: "country:in",
//             }}
//             styles={{
//               container: { flex: 0, width: "100%" },
//               textInput: {
//                 height: 45,
//                 color: "#111827",
//                 fontSize: 16,
//                 borderColor: "#ddd",
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 paddingLeft: 10,
//                 backgroundColor: "#fff",
//               },
//               listView: {
//                 backgroundColor: "#fff",
//                 borderRadius: 10,
//                 elevation: 3,
//                 marginTop: 5,
//               },
//             }}
//           />
//         </KeyboardAvoidingView>
//       )}

//       {/* Bottom Ride Confirmation */}
//       {!showSearch && (
//         <View
//           style={{
//             position: "absolute",
//             bottom: 150,
//             alignSelf: "center",
//             width: "90%",
//             backgroundColor: "#fff",
//             borderRadius: 20,
//             padding: 16,
//             shadowColor: "#000",
//             shadowOpacity: 0.15,
//             shadowRadius: 10,
//             elevation: 5,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 20,
//             }}
//           >
//             <Text style={{ color: "#111827", fontSize: 16, fontWeight: "600" }}>Where to?</Text>
//           </View>

//           <View style={{ flexDirection: "row" }}>
//             <TouchableOpacity
//               onPress={handleDestinationClick}
//               style={{
//                 flex: 1,
//                 backgroundColor: "#f59e0b",
//                 borderRadius: 16,
//                 paddingVertical: 20,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginRight: 12,
//               }}
//             >
//               <Ionicons name="location-outline" size={24} color="#fff" />
//               <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600" }}>Destination</Text>
//               <Text style={{ color: "#fff", fontSize: 12 }}>
//                 {destination ? destination.name : "Enter Destination"}
//               </Text>
//             </TouchableOpacity>

//             {destination && (
//               <TouchableOpacity
//                 onPress={handleConfirmRide}
//                 style={{
//                   flex: 1,
//                   backgroundColor: "#111827",
//                   borderRadius: 16,
//                   paddingVertical: 20,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
//                 <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600" }}>Confirm</Text>
//                 <Text style={{ color: "#fff", fontSize: 12 }}>Save Ride</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const detailedMapStyle = [
//   { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
//   { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
//   { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
//   { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
//   { featureType: "poi", elementType: "all", stylers: [{ visibility: "on" }] },
//   { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
// ];
  