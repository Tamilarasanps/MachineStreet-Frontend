import React, { useEffect, useState } from "react";
import "../global.css";
import { Stack } from "expo-router";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FileUploadProvider } from "./context/FileUpload";
import { FormatTimeProvider } from "./context/FormatTime";
import Toast from "react-native-toast-message";
import SplashScreen from "./screens/SplashScreen";
import { View } from "react-native";

const Layout = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // ⏱️ Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LoadingProvider>
            <FileUploadProvider>
              <FormatTimeProvider>
                {/* {showSplash ? (
                  <SplashScreen />
                ) : ( */}
                  <>
                    <Stack screenOptions={{ headerShown: false }} />

                    <Toast />
                  </>
                {/* )} */}
              </FormatTimeProvider>
            </FileUploadProvider>
          </LoadingProvider>
        </GestureHandlerRootView>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Layout;

{
  /*  
      <SocketProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToastProvider>
          <LoadingProvider>
            <FileUploadProvider>
              <FormatTimeProvider>
                ✅ This renders the toast 
                <SafeAreaView
                    style={{ zIndex: 9999, backgroundColor: "ffffff" }}
                  ></SafeAreaView>
                <Stack screenOptions={{ headerShown: false }} />
                <Toast />
              </FormatTimeProvider>
            </FileUploadProvider>
          </LoadingProvider>
          </ToastProvider>
        </GestureHandlerRootView>
      </SocketProvider>
    </AuthProvider> */
}
