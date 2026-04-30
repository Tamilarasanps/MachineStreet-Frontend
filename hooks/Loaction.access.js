import * as Location from "expo-location";
import { Linking, Platform } from "react-native";

async function locationAccess(setUserDetails) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Location permission denied");

      // 👉 Ask user to open settings manually
      if (Platform.OS === "ios") {
        Linking.openURL("app-settings:"); // iOS settings
      } else {
        Linking.openSettings(); // Android settings
      }

      return false;
    }

    const location = await Location.getCurrentPositionAsync({});

    if (location?.coords?.latitude && location?.coords?.longitude) {
      setUserDetails((prev) => ({
        ...prev,
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      }));
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error getting user location:", err.message);
    return null;
  }
}

export default locationAccess;
