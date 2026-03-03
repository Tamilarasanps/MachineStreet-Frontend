import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function BusinessCard() {
  const { width } = useWindowDimensions();

  // Fixed printable size
  const CARD_WIDTH = 1000;
  const CARD_HEIGHT = 570;

  // Limit desktop preview size
  const MAX_DESKTOP_PREVIEW_WIDTH = 600;

  const previewWidth =
    width <= 480
      ? width - 20
      : Math.min(width * 0.6, MAX_DESKTOP_PREVIEW_WIDTH);

  const scale = previewWidth / CARD_WIDTH;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* SCALE WRAPPER */}
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: [{ scale }],
        }}
      >
        {/* FIXED CARD */}
        <View
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 40,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 15 },
            elevation: 20,
          }}
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={["#0F172A", "#1E293B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Decorative Shapes */}
          <View
            style={{
              position: "absolute",
              top: -120,
              left: -120,
              width: 350,
              height: 350,
              backgroundColor: "#4f46e5",
              borderRadius: 999,
              opacity: 0.35,
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: -150,
              right: -150,
              width: 400,
              height: 400,
              backgroundColor: "#f97316",
              borderRadius: 999,
              opacity: 0.25,
            }}
          />

          <View
            style={{
              position: "absolute",
              top: 60,
              right: 120,
              width: 120,
              height: 120,
              backgroundColor: "rgba(255,255,255,0.08)",
              transform: [{ rotate: "45deg" }],
              borderRadius: 20,
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: 100,
              left: 120,
              width: 160,
              height: 160,
              backgroundColor: "rgba(255,255,255,0.05)",
              transform: [{ rotate: "12deg" }],
              borderRadius: 30,
            }}
          />

          {/* Content */}
          <View
            style={{
              flex: 1,
              padding: 60,
              justifyContent: "space-between",
            }}
          >
            {/* Top Section */}
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 42,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                Arun Premium Textiles
              </Text>

              <Text
                style={{
                  color: "#a5b4fc",
                  marginTop: 8,
                  fontSize: 20,
                }}
              >
                @ArunTextiles
              </Text>

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: "rgba(99,102,241,0.3)",
                  alignSelf: "flex-start",
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    color: "#c7d2fe",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Textile Manufacturing
                </Text>
              </View>
            </View>

            {/* Bottom Section */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* Left Column */}
              <View style={{ width: "65%", gap: 18 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="phone" size={24} color="#F8FAFC" />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      marginLeft: 16,
                      fontWeight: "600",
                    }}
                  >
                    +91 9876543210
                  </Text>
                </View>

                <View
                  style={{ height: 1, backgroundColor: "rgba(148,163,184,0.3)" }}
                />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color="#F8FAFC"
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      marginLeft: 16,
                      fontWeight: "600",
                    }}
                  >
                    Madurai, Tamil Nadu
                  </Text>
                </View>

                <View
                  style={{ height: 1, backgroundColor: "rgba(148,163,184,0.3)" }}
                />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="star" size={22} color="#FBBF24" />
                  <Text
                    style={{
                      color: "#e2e8f0",
                      fontSize: 18,
                      marginLeft: 12,
                    }}
                  >
                    4.3 Rating • 124 Followers
                  </Text>
                </View>
              </View>

              
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}