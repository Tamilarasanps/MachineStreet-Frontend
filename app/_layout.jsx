// app/_layout.js
import { useState, useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";
import "../global.css";
import { LocationProvider } from "@/context/LocationContext";
import { FileUploadProvider } from "@/context/FileUpload";
import { FormatTimeProvider } from "@/context/FormatTime";
import { linking } from "./linking";
import ToastManager from "toastify-react-native";
import { View, Text } from "react-native";
import SplashScreen from "@/components/SplashScreen"; // import your splash

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const toastConfig = {
    success: (props) => (
      <View
        style={{
          backgroundColor: "#4CAF50",
          padding: 16,
          borderRadius: 10,
          maxWidth: 400,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {props.text1}
        </Text>
        {props.text2 && <Text style={{ color: "white" }}>{props.text2}</Text>}
      </View>
    ),
    error: (props) => (
      <View
        style={{
          backgroundColor: "#F44336",
          padding: 16,
          borderRadius: 10,
          maxWidth: 400,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {props.text1}
        </Text>
        {props.text2 && <Text style={{ color: "white" }}>{props.text2}</Text>}
      </View>
    ),
    info: (props) => (
      <View
        style={{
          backgroundColor: "#2196F3",
          padding: 16,
          borderRadius: 10,
          maxWidth: 400,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {props.text1}
        </Text>
        {props.text2 && <Text style={{ color: "white" }}>{props.text2}</Text>}
      </View>
    ),
  };

  // Render SplashScreen first
  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      <ToastManager config={toastConfig} />

      <LocationProvider>
        <FileUploadProvider>
          <FormatTimeProvider>
            <AppProvider>
              <Stack linking={linking}>
                <Stack.Screen
                  name="(tabs)" // corresponds to app/index.js
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="E2" options={{ headerShown: false }} />
                <Stack.Screen name="Login" options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" options={{ headerShown: false }} />
                <Stack.Screen
                  name="ServicePage"
                  options={{ headerShown: false }}
                />
              </Stack>
            </AppProvider>
          </FormatTimeProvider>
        </FileUploadProvider>
      </LocationProvider>
    </>
  );
}
