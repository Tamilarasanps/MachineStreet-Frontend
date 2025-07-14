import React, { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// Screens
import ProfilePage from "../../screens/(profile)/ProfilePage";
import Login from "../../screens/(auth)/(login)/Login";
import SignUp from "../../screens/(auth)/(SignIn)/SignUp";

const Stack = createNativeStackNavigator();

export default function MechanicProfileStack() {
  const [isLogin, setIsLogin] = useState(false);
  // const [loading, setLoading] = useState(true);

  // Check token every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("userToken");

          setIsLogin(!!storedToken);
        } catch (error) {
          console.error("Error reading token:", error);
          setIsLogin(false);
        }
      };

      checkToken();
    }, [])
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* If user is NOT logged in, show Login & SignUp */}
      {!isLogin ? (
        <>
          <Stack.Screen
            name="LoginPage"
            component={Login}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "Sign Up" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{ title: "Profile" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
