import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MechanicList_2 from "@/app/mechanicApp/MechanicList_2";

export default function AuthStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MechanicList"
        component={MechanicList_2}
        options={{ title: "MechanicList" }}
      />
    </Stack.Navigator>
  );
}
