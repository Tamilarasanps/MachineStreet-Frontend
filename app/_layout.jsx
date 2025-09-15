// app/_layout.js
import Header from "@/components/Header";
import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";
import { LocationProvider } from "@/context/LocationContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { FileUploadProvider } from "@/context/FileUpload";
import { FormatTimeProvider } from "@/context/FormatTime";
import { linking } from "./linking";

export default function RootLayout() {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green", backgroundColor: "#e6ffe6" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "green",
        }}
        text2Style={{
          fontSize: 14,
          color: "black",
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "orange", backgroundColor: "#ffffffff" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "orange",
        }}
        text2Style={{
          fontSize: 10,
          color: "black",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red", backgroundColor: "#ffe6e6" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "red",
        }}
        text2Style={{
          fontSize: 14,
          color: "black",
        }}
      />
    ),
  };
  return (
    <>
      {/* <Header /> */}
      <View style={{ zIndex: 9999 }}>
        <Toast config={toastConfig} />
      </View>

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
              </Stack>
            </AppProvider>
          </FormatTimeProvider>
        </FileUploadProvider>
      </LocationProvider>
    </>
  );
}
