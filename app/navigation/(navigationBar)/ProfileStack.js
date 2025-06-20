import React, { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import Login from "@/app/screens/(auth)/(login)/Login";
import SignUp from "@/app/screens/(auth)/(SignIn)/SignUp";
import ProfileScreen from "@/app/screens/(profile)/ProfileScreen";
// import ProfilePage from "@/app/mechanicApp/ProfilePage";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 👇 Runs every time the screen gains focus

  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("userToken");
          setIsLogin(!!storedToken);
        } catch (error) {
          console.error("Error checking token:", error);
          setIsLogin(false);
        } finally {
          setLoading(false);
        }
      };

      checkToken();
    }, [])
  );

  // Optional loading placeholder
  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogin ? (
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
      ) : (
        <Stack.Screen
          name="LoginPage"
          component={Login}
          options={{ title: "Login" }}
        />
      )}
      <Stack.Screen
        name="SignUp" // 👈 new screen
        component={SignUp}
        options={{ title: "SignUp ", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
