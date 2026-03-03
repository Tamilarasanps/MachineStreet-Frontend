import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

export default function BusinessCard() {
  const { width } = useWindowDimensions();

  // Fixed printable size
  const CARD_WIDTH = 1000;
  const CARD_HEIGHT = 570;

  // Desktop preview limit
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
            backgroundColor: "#ffffff",
            borderRadius: 40,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 15 },
            elevation: 20,
          }}
        >
          {/* Content */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 80,
              paddingVertical: 70,
              justifyContent: "space-between",
            }}
          >
            {/* Top Section */}
            <View>
              <Text
                style={{
                  fontSize: 46,
                  fontWeight: "bold",
                  color: "#111827",
                  letterSpacing: 1,
                }}
              >
                ARUN INDUSTRIAL WORKS
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  color: "#6b7280",
                  marginTop: 10,
                }}
              >
                Textile Machinery & Heavy Equipment Specialists
              </Text>
            </View>

            {/* Contact Section */}
            <View style={{ gap: 20, marginBottom: 80 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="phone" size={26} color="#b91c1c" />
                <Text
                  style={{
                    fontSize: 20,
                    color: "#374151",
                    marginLeft: 18,
                  }}
                >
                  +91 9876543210
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="map-pin" size={26} color="#b91c1c" />
                <Text
                  style={{
                    fontSize: 20,
                    color: "#374151",
                    marginLeft: 18,
                  }}
                >
                  Madurai, Tamil Nadu
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="settings" size={26} color="#b91c1c" />
                <Text
                  style={{
                    fontSize: 18,
                    color: "#4b5563",
                    marginLeft: 18,
                  }}
                >
                  Loom Machines • CNC • Automation • Fabrication
                </Text>
              </View>
            </View>
          </View>

          {/* INDUSTRIAL FOOTER SVG */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          >
            <Svg
              width="100%"
              height="160"
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
            >
              {/* Ground Base */}
              <Path d="M0 110 L1000 110 L1000 160 L0 160 Z" fill="#7f1d1d" />

              {/* Sawtooth Factory */}
              <Path
                d="
                  M40 110 
                  L40 70 
                  L100 55 
                  L160 70 
                  L220 55 
                  L280 70 
                  L340 55 
                  L400 70 
                  L400 110 Z"
                fill="#991b1b"
              />

              {/* Warehouse */}
              <Path
                d="
                  M440 110 
                  L440 65 
                  L640 65 
                  L640 110 Z"
                fill="#991b1b"
              />

              {/* Water Tank */}
              <Path
                d="
                  M720 110 
                  L720 60 
                  L780 60 
                  L780 110 Z"
                fill="#991b1b"
              />
              <Circle cx="750" cy="50" r="20" fill="#991b1b" />

              {/* Gear */}
              <Circle cx="880" cy="90" r="28" fill="#7f1d1d" />
            </Svg>
          </View>
        </View>
      </View>
    </View>
  );
}