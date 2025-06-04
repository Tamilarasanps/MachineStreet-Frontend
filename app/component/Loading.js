import React from "react";
import { View, ActivityIndicator,  } from "react-native";

const Loading = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
      }}
    >
      <ActivityIndicator size="large" color="#2095A2" />
    </View>
  );
};

export default Loading;
