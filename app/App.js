import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";

export default function App({ isOpen, setIsOpen }) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  if (!isOpen) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: isSmallScreen ? "80%" : 300,
        backgroundColor: "#fff",
        elevation: 10,
        zIndex: 10,
      }}
    >
      {isSmallScreen && (
        <Pressable
          onPress={() => setIsOpen(false)}
          className="p-2 bg-gray-200 mt-24"
        >
          <Text>Close</Text>
        </Pressable>
      )}

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} className="mb-2 p-3 bg-gray-100 rounded">
            <Text>Filter Option {i + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
