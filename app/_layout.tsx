import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        if (error) throw error;
        if (!fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}></Stack>
        </>
    );
}