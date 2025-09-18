import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

// Create Context
const LocationContext = createContext();

// Provider Component
export const LocationProvider = ({ children }) => {
  const [geoCoords, setGeoCoords] = useState(null);
  const [address, setAddress] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [error, setError] = useState(null);

  // Get location permission & coordinates
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission not granted");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setGeoCoords(currentLocation.coords);
      } catch (err) {
        setErrorMsg("Failed to get location");
      }
    })();
  }, []);

  // Fetch address from backend using coordinates
  useEffect(() => {
    const fetchAddress = async () => {
      if (!geoCoords?.latitude || !geoCoords?.longitude) return;

      try {
        const response = await fetch(
          `https://api.machinestreets.com/api/reverse-geocode?lat=${geoCoords.latitude}&lon=${geoCoords.longitude}`
        );
        if (!response.ok) throw new Error("Failed to fetch address");

        const data = await response.json();

        if (data.address) {
          setAddress({
            district:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              state_district ||
              "",
            state: data.address.state || "",
            country: data.address.country || "",
          });
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        setAddress(null);
      }
    };

    fetchAddress();
  }, [geoCoords]);

  return (
    <LocationContext.Provider value={{ geoCoords, address, errorMsg, error }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook
export const useLocation = () => useContext(LocationContext);
