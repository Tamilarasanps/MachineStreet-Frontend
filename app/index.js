import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomePageAdmin from "./AdminFolder/HomePageAdmin";
import LandingPage from "./screens/LandingPage";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";


export default function Index() {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (role === "admin") return <HomePageAdmin />;

  return Platform.OS === "web" ? <LandingPage /> : <BottomNavBar />;
}
