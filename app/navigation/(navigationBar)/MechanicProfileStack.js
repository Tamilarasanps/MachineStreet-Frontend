import React, { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import ProfilePage from "../../screens/(profile)/ProfilePage";
import Login from "../../screens/(auth)/(login)/Login";
import SignUp from "../../screens/(auth)/(SignIn)/SignUp";

const Stack = createNativeStackNavigator();

export default function MechanicProfileStack() {
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
          name="MechanicProfilePage"
          component={ProfilePage}
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
