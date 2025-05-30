import React from "react";
import LandingPage from "./screens/LandingPage";
import { Platform } from "react-native";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
export default function index() {
  return (
    <>
      {Platform.OS === "web" && <LandingPage />}
      {Platform.OS !== "web" && <BottomNavBar />}
    </>
  );
}
