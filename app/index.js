import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomePageAdmin from "./AdminFolder/HomePageAdmin";
import LandingPage from "./screens/LandingPage";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
import QrModal from "./mechanicApp/QrModal";
import SplashScreen from "./screens/SplashScreen";
import RoleSelection from "./mechanicApp/RoleSelection";
import SignUp from "./screens/(auth)/(SignIn)/SignUp";
import ProfilePage from "./screens/(profile)/ProfilePage";
import App from "./App";

export default function Index() {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
      } catch (error) {
        console.error("Failed to get role:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getRole();
  }, []);

  if (isLoading) {
    return Platform.OS === "web" ? <LandingPage /> : <BottomNavBar />;
  }

  if (Platform.OS === "web") {
    return role === "admin" ? <HomePageAdmin /> : <LandingPage />;
  }

  return role === "admin" ? <HomePageAdmin /> : <BottomNavBar />;

  // return <App />; 
}
