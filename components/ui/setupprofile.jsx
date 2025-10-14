import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupProfile({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied to access gallery!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCompleteProfile = () => {
    navigation.navigate("EnableLocation");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center items-center relative">
   
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 p-2"
        >
          <Text className="text-2xl text-gray-600">←</Text>
        </TouchableOpacity>

      
        <View className="items-center mb-8 mt-6 px-4">
          <Text className="text-2xl font-semibold text-gray-900 mb-1 text-center">
            Complete Your Profile
          </Text>
          <Text className="text-gray-500 text-center text-sm">
            Don’t worry, only you can see your personal data. No one else will
            be able to see it.
          </Text>
        </View>

    
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center relative overflow-hidden">
            <Image
              source={{
                uri:
                  image ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              className="w-24 h-24 rounded-full"
            />
          
          </View>
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-2"
            >
              <Text className="text-white text-sm">✎</Text>
            </TouchableOpacity>
        </View>

     
        <View className="space-y-5  w-full">
          <View>
            <Text className="text-gray-700 mb-2">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 w-full"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
                 placeholderTextColor="#9ca3af"
            />
          </View>

          <View >
            <Text className="text-gray-700 mb-2">Email Address</Text>
            <TextInput
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 w-full"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
                 placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Gender</Text>
            <View className="border border-gray-300 mb-4 rounded-lg w-full">
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>
        </View>

      
        <TouchableOpacity
          onPress={handleCompleteProfile}
          className="bg-amber-500 mt-8 py-4 rounded-full w-full"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Complete Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
