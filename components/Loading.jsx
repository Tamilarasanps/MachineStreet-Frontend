// components/Loading.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function Loading({ style }) {
  return (
    <View style={[styles.overlay, style]}>
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      <ActivityIndicator size="large" color="#2095A2" /> 
      {/* teal-600 */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // cover parent
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
