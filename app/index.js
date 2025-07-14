import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomePageAdmin from "./AdminFolder/HomePageAdmin";
import LandingPage from "./screens/LandingPage";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
import MechanicList_2 from "./mechanicApp/MechanicList_2";
import QrScan from "./mechanicApp/QrScan";
import ProfilePage from "./screens/(profile)/ProfilePage";

export default function Index() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setToken(token);

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

  return Platform.OS === "web" ? (
    token ? (
      <MechanicList_2 />
    ) : (
      <LandingPage />
    )
  ) : (
    <BottomNavBar />
  );
  // return Platform.OS === "web" ? <ProfilePage /> : <QrScan />;
}
