// app/_layout.js
import Header from "@/components/Header";
import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";
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
        autoHide={props.autoHide}
        visibilityTime={props.visibilityTime} // <--- forward visibilityTime
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
        autoHide={props.autoHide}
        visibilityTime={props.visibilityTime} // <--- forward visibilityTime
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
        autoHide={props.autoHide}
        visibilityTime={props.visibilityTime} // <--- forward visibilityTime
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
              <Toast config={toastConfig} />
            </AppProvider>
          </FormatTimeProvider>
        </FileUploadProvider>
      </LocationProvider>
    </>
  );
}
