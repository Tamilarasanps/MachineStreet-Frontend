import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

// Create Context
const LocationContext = createContext();

// Provider Component
export const LocationProvider = ({ children }) => {
  const [geoCoords, setGeoCoords] = useState(null);
  const [address, setAddress] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  // Get location permission & coordinates
  useEffect(() => {
    (async () => {
      try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setStatus(status);
        if (status !== "granted") {
          setErrorMsg("Location permission not granted");
          return;
        }
      } catch (err) {
        setErrorMsg("Failed to get location");
      }
    })();
  }, []);

  // // Fetch address from backend using coordinates
  // useEffect(() => {
  //   // const fetchAddress = async () => {
  //   //   if (!geoCoords?.latitude || !geoCoords?.longitude) return;
  //   //   try {
  //   //     // const response = await fetch(
  //   //     //   `http://192.168.43.158:5000/api/reverse-geocode?lat=${11.072312790174317}&lon=${77.34030207426076}`
  //   //     // );
  //   //     // if (!response.ok) throw new Error("Failed to fetch address");

  //   //     // const data = await response.json();
  //   //     // console.log('data :', data.address)

  //   //     // if (data.address) {
  //   //     //   setAddress({
  //   //     //     district:
  //   //     //       data.address.city ||
  //   //     //       data.address.town ||
  //   //     //       data.address.village ||
  //   //     //       state_district ||
  //   //     //       "",
  //   //     //     state: data.address.state || "",
  //   //     //     country: data.address.country || "",
  //   //     //   });
  //   //     // }
  //   //     setError(null);
  //   //   } catch (err) {
  //   //     setError(err.message);
  //   //     setAddress(null);
  //   //   }
  //   // };

  //   // fetchAddress();
  // }, [geoCoords]);

  return (
    <LocationContext.Provider
      value={{ geoCoords, address, errorMsg, error, status }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook
export const useLocation = () => useContext(LocationContext);
