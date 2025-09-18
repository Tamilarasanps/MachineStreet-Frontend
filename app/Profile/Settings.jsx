import { Pressable, View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import useApi from "@/hooks/useApi";
import { router } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Settings = ({ setModal, setViewType }) => {
  const { postJsonApi } = useApi();
  //   logout
  const handleLogout = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        // Send API to clear cookie
        const result = await postJsonApi(
          "api/logout",
          "application/json",
          {},
          { secure: true }
        );
        if (result.status === 200) {
          // Clear localStorage
          localStorage.removeItem("role");
          setModal("");
          // Redirect
          router.replace("/Login");
        }
      } else {
        // Mobile: just clear SecureStore values
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("role");
        router.replace("/Login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
  return (
    <View className="space-y-4 h-fit w-full">
      <Pressable
        className="flex-row items-center gap-4 border border-gray-300 rounded-md px-4 py-3"
        onPress={() => {
          setViewType("edit-2");
          setModal("")
        }}
      >
        <FontAwesome5 name="user-edit" size={30} color="#2095A2" />
        <Text className="text-lg font-semibold text-gray-700">
          Edit UserDetails
        </Text>
      </Pressable>
      <Pressable
        className="flex-row items-center gap-4 border border-gray-300 rounded-md px-4 py-3 mt-4"
        onPress={() => {
          setModal("reset");
        }}
      >
        <FontAwesome5 name="user-lock" size={30} color="#2095A2" />
        <Text className="text-lg font-semibold text-gray-700">
          Reset Password
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          handleLogout();
        }}
        className="flex-row items-center gap-4 border border-gray-300 rounded-md px-4 py-3 mt-4"
      >
        <MaterialIcons name="logout" size={30} color="#2095A2" />
        <Text className="text-lg font-semibold text-gray-700">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Settings;
