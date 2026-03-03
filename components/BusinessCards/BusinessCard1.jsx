import React, { forwardRef } from "react";
import { View, Text, Image, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const BusinessCard = forwardRef(({ isForCapture = false }, ref) => {
  const { width } = useWindowDimensions();

  // Fixed printable card size
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
        ref={ref}
        collapsable={false}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: [{ scale }],
        }}
      >
        {/* ACTUAL FIXED CARD */}
        <View
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 40,
            overflow: "hidden",
            backgroundColor: "#0f172a",
            flexDirection: "row",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 15 },
            elevation: 20,
          }}
        >
          {/* LEFT PANEL */}
          {isForCapture && Platform.OS === "web" ? (
            // Use CSS gradient for capture
            <View
              style={{
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
                backgroundImage: "linear-gradient(180deg, #ff6b00, #ff9500)",
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop",
                }}
                resizeMode="cover"
                style={{
                  width: 260,
                  height: 200,
                  borderRadius: 20,
                }}
                crossOrigin="anonymous"
              />
            </View>
          ) : (
            <LinearGradient
              colors={["#ff6b00", "#ff9500"]}
              style={{
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop",
                }}
                resizeMode="cover"
                style={{
                  width: 260,
                  height: 200,
                  borderRadius: 20,
                }}
              />
            </LinearGradient>
          )}

          {/* RIGHT SECTION */}
          <View
            style={{
              flex: 1,
              padding: 60,
              justifyContent: "space-between",
            }}
          >
            {/* BRAND */}
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 48,
                  fontWeight: "900",
                  letterSpacing: 1,
                }}
              >
                ARUN INDUSTRIAL
              </Text>

              <Text
                style={{
                  color: "#38bdf8",
                  fontSize: 20,
                  marginTop: 8,
                }}
              >
                MACHINE MECHANICS & EQUIPMENT SERVICE
              </Text>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 2,
                backgroundColor: "#334155",
                marginVertical: 30,
              }}
            />

            {/* CONTACT */}
            <View style={{ gap: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isForCapture && Platform.OS === "web" ? (
                  <Text style={{ fontSize: 28, color: "#ff6b00" }}>☎</Text>
                ) : (
                  <Feather name="phone" size={28} color="#ff6b00" />
                )}
                <Text
                  style={{
                    color: "#cbd5e1",
                    marginLeft: 20,
                    fontSize: 22,
                  }}
                >
                  +91 9876543210
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isForCapture && Platform.OS === "web" ? (
                  <Text style={{ fontSize: 28, color: "#ff6b00" }}>📍</Text>
                ) : (
                  <Feather name="map-pin" size={28} color="#ff6b00" />
                )}
                <Text
                  style={{
                    color: "#cbd5e1",
                    marginLeft: 20,
                    fontSize: 22,
                  }}
                >
                  Madurai, Tamil Nadu
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isForCapture && Platform.OS === "web" ? (
                  <Text style={{ fontSize: 28, color: "#ff6b00" }}>🛠</Text>
                ) : (
                  <Feather name="tool" size={28} color="#ff6b00" />
                )}
                <Text
                  style={{
                    color: "#94a3b8",
                    marginLeft: 20,
                    fontSize: 20,
                  }}
                >
                  CNC • Heavy Machinery • Welding • Engine Repair
                </Text>
              </View>
            </View>

            {/* TAGLINE */}
            <View
              style={{
                backgroundColor: "rgba(14,165,233,0.15)",
                paddingVertical: 18,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#7dd3fc",
                  fontWeight: "bold",
                  fontSize: 20,
                  letterSpacing: 1,
                }}
              >
                24/7 INDUSTRIAL SUPPORT
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default BusinessCard;
