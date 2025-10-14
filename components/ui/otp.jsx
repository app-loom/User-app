import React, { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtpScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (text, index) => {
    if (text.length > 1) return; 
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      Alert.alert("Error", "Enter 4-digit OTP");
      return;
    }
    navigation.replace("SetupProfile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center px-2"
      >
        <Text className="text-3xl font-bold mb-4 text-center">Verify OTP</Text>
        <Text className="text-gray-500 mb-8 text-center">
          Enter the OTP sent to {phone.replace(/\d(?=\d{2})/g, "*")}

        </Text>

        <View className="flex-row justify-between mb-12 w-full max-w-md">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              className="w-14 h-14 border border-gray-300 rounded-lg text-center text-2xl text-gray-900"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          className="bg-amber-500 py-4 rounded-full w-full max-w-lg"
        >
          <Text className="text-white text-center font-bold text-md">Verify</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
