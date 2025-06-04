import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState({});

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch address whenever location updates
  useEffect(() => {
    if (location) {
      console.log(location);
      fetchAddress(location.latitude, location.longitude);
    }
  }, [location]);

  const getLocation = async () => {
    try {
      if (Platform.OS === "web") {
        if ("permissions" in navigator && "geolocation" in navigator) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });

          if (permission.state === "denied") {
            setErrorMsg(
              "Location permission denied. Please enable it in your browser settings."
            );
            return;
          }

          // Explicitly request location access if not denied
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              await fetchAddress(latitude, longitude);
            },
            (error) => {
              console.error("Geolocation Error:", error);
              setErrorMsg("Location access blocked. Please allow it.");
            },
            { enableHighAccuracy: true }
          );
        } else {
          setErrorMsg("Geolocation not supported by your browser.");
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg(
            "Location permission denied. Please enable it in your device settings."
          );
          return;
        }

        // Request location after permission is granted
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = locationResult.coords;
        setLocation({ latitude, longitude });
        await fetchAddress(latitude, longitude);
      }
    } catch (err) {
      console.error("Location error:", err);
      setErrorMsg("Unable to retrieve location. Please check your settings.");
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
          `http://192.168.1.9:4000/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
      );
      console.log("response :", response);

      const data = await response.json();

      console.log("location :", data);

      if (data.address) {
        setAddress({
          district:
            data.address.city || 
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          country: data.address.country || "",
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  console.log("location in geo :", location);
  return {
    geoCoords: location || {},
    errorMsg,
    address: address || "Fetching address...",
  };
};

export default useGeoLocation;
