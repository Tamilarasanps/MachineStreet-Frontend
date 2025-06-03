import React from "react";
import LandingPage from "./screens/LandingPage";
import { Platform } from "react-native";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
import DropdownWithKeyboard from "./mechanicApp/Textfile";
export default function index() {
  return (
    <>
      {Platform.OS === "web" && <LandingPage />}
      {/* <DropdownWithKeyboard /> */}
      {Platform.OS !== "web" && <BottomNavBar />}
    </>
  );
}
