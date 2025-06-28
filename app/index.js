import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomePageAdmin from "./AdminFolder/HomePageAdmin";
import LandingPage from "./screens/LandingPage";
import BottomNavBar from "./navigation/(navigationBar)/BottomNavBar";
import AdminQrPage from "./AdminFolder/Qr/AdminQrPage";
import QrPosterMobile from "./AdminFolder/Qr/AdminQrPageMobile";
import QrPage from "./AdminFolder/QrPage";

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
  // return <HomePageAdmin />;
  // return <AdminQrPage />;
  // return <QrPosterMobile />;
  // return <QrPage />;
}
