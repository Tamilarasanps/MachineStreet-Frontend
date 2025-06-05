import React, { useEffect, useState } from "react";
import LandingPage from "./screens/LandingPage";
import { Platform } from "react-native";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";

import AdminHomePage from "./AdminFolder/MenuNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
      } catch (error) {
        console.error("Failed to get role:", error);
      }
    };
    getRole();
  }, []);
  if (role === null) return <LandingPage />; // or a loading spinner

  if (Platform.OS === "web" && role !== "admin") {
    if (Platform.OS === "web") {
      <LandingPage />;
    } else {
      <BottomNavBar />;
    }
  }
  if (Platform.OS === "web" && role === "admin") return <AdminHomePage />;

  return role === "admin" ? <AdminHomePage /> : <BottomNavBar />;
}
