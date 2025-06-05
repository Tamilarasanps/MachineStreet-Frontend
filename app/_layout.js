import React from "react";
import {  SafeAreaView } from "react-native";
import "../global.css";
import { Stack } from "expo-router";
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FileUploadProvider } from "./context/FileUpload";
import { FormatTimeProvider } from "./context/FormatTime";
import Toast from "react-native-toast-message";
import { ToastProvider } from "react-native-toast-notifications";

const Layout = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToastProvider>
            <LoadingProvider>
              <FileUploadProvider>
                <FormatTimeProvider>
                  <Toast /> {/* ✅ This renders the toast */}
                  <SafeAreaView
                    style={{ zIndex: 9999, backgroundColor: "#d5d8dc" }}
                  >
                    {/* Your header or nav */}
                  </SafeAreaView>
                  <Stack screenOptions={{ headerShown: false }} />
                </FormatTimeProvider>
              </FileUploadProvider>
            </LoadingProvider>
          </ToastProvider>
        </GestureHandlerRootView>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Layout;
