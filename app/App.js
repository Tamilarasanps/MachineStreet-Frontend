import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import MechanicList_2 from "./mechanicApp/MechanicList_2";

export default function App({ isOpen, setIsOpen }) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  // const [isOpen, setIsOpen] = useState(false); // default: hidden

  return (
    <View className="flex-1">
      {isOpen && (
        <View
          style={{
            position: isSmallScreen ? "absolute" : "relative",
            left: 0,
            top: 0,
            bottom: 0,
            width: isSmallScreen ? "80%" : 300,
            backgroundColor: "#fff",
            elevation: 10, // Android
            height: "100%",
          }}
        >
          {/* Close Button */}
          {isSmallScreen && (
            <Pressable
              onPress={() => setIsOpen(false)}
              className="p-2 bg-gray-200"
            >
              <Text>Close</Text>
            </Pressable>
          )}

          {/* Scrollable Filter Content */}
          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <View key={i} className="mb-2 p-3 bg-gray-100 rounded">
                <Text>Filter Option {i + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* <MechanicList_2 /> */}
    </View>
  );
}
