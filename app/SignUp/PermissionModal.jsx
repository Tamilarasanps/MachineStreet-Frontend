import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Platform,
  Linking,
} from "react-native";

const PermissionModal = () => {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 300,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
          >
            Location Permission Needed
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: "left",
              marginBottom: 20,
            }}
          >
            We need your location to continue. Please enable it in
            settings.
          </Text>

          <Pressable
            onPress={() => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            }}
            style={{
              backgroundColor: "#0d9488",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Open Settings
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PermissionModal;
