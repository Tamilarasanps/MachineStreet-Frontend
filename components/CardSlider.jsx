import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { useRef } from "react";

import BusinessCard1 from "./BusinessCards/BusinessCard1";
import BusinessCard2 from "./BusinessCards/BusinessCard2";
import BusinessCard3 from "./BusinessCards/BusinessCard3";

const MemoCard1 = React.memo(BusinessCard1);
const MemoCard2 = React.memo(BusinessCard2);
const MemoCard3 = React.memo(BusinessCard3);

export default function CardSlider() {
  const captureRef = useRef(null);

  const downloadCard = async () => {
    try {
      if (Platform.OS === "web") {
        const uri = await captureRef.current.capture();
        const link = document.createElement("a");
        link.href = uri;
        link.download = "business-card.png";
        link.click();
        return;
      }

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required");
        return;
      }

      const uri = await captureRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("BusinessCards", asset, false);

      Alert.alert("Saved to gallery");
    } catch (e) {
      console.log(e);
    }
  };

  const { width } = useWindowDimensions();
  const isAndroid = Platform.OS === "android";

  const isTabletOrDesktop = width >= 768;
  const isMobile = width < 768;

  const cardWidth = isMobile ? width * 0.9 : width * 0.75;
  const cardHeight = cardWidth * (9 / 16);

  const cards = useMemo(() => [MemoCard1, MemoCard2, MemoCard3], []);
  const [index, setIndex] = useState(0);
  const animatedIndex = useSharedValue(0);

  const animateTo = (newIndex) => {
    animatedIndex.value = withTiming(newIndex, { duration: 300 });
    setIndex(newIndex);
  };

  const goUp = () => {
    const next = Math.max(index - 1, 0);
    if (next !== index) animateTo(next);
  };

  const goDown = () => {
    const next = Math.min(index + 1, cards.length - 1);
    if (next !== index) animateTo(next);
  };

  return (
    <View style={styles.wrapper}>
      {isMobile && (
        <Pressable onPress={goUp} style={styles.mobileTopArrow}>
          <View style={styles.arrowUp} />
        </Pressable>
      )}

      <View
        style={[
          styles.sliderArea,
          { height: isMobile ? cardHeight * 1.8 : cardHeight * 1.2 },
        ]}
      >
        {cards.map((Card, i) => {
          const style = useAnimatedStyle(() => {
            const position = i - animatedIndex.value;

            const translateY = interpolate(
              position,
              [-1, 0, 1],
              [-cardHeight * 0.55, 0, cardHeight * 0.55],
            );

            const scale = interpolate(position, [-1, 0, 1], [0.95, 1, 0.95]);
            const rotate = interpolate(position, [-1, 0, 1], [-5, 0, 5]);
            const opacity = interpolate(
              position,
              [-2, -1, 0, 1, 2],
              [0.4, 0.6, 1, 0.6, 0.4],
            );

            return {
              transform: [
                { translateY },
                { scale },
                { rotate: `${rotate}deg` },
              ],
              opacity,
              zIndex: cards.length - Math.abs(i - index),
              elevation: isAndroid ? cards.length - Math.abs(i - index) : 0,
            };
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.card,
                { width: cardWidth, height: cardHeight },
                style,
              ]}
            >
              {i === index ? (
                <ViewShot
                  ref={captureRef}
                  options={{ format: "png", quality: 1 }}
                  style={{ flex: 1 }}
                >
                  <Card isForCapture />
                </ViewShot>
              ) : (
                <Card />
              )}
            </Animated.View>
          );
        })}
      </View>

      {isMobile && (
        <Pressable onPress={goDown} style={styles.mobileBottomArrow}>
          <View style={styles.arrowDown} />
        </Pressable>
      )}

      {isTabletOrDesktop && (
        <View style={styles.desktopArrows}>
          <Pressable onPress={goUp} style={styles.arrow}>
            <View style={styles.arrowUp} />
          </Pressable>
          <Pressable onPress={goDown} style={styles.arrow}>
            <View style={styles.arrowDown} />
          </Pressable>
        </View>
      )}

      <Pressable
        onPress={downloadCard}
        style={{
          marginTop: 20,
          backgroundColor: "#0ea5e9",
          paddingHorizontal: 30,
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Download Card
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  sliderArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  card: {
    position: "absolute",
    borderRadius: 20,
    overflow: "hidden",
  },
  desktopArrows: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -40 }],
    alignItems: "center",
  },
  arrow: { padding: 15 },
  mobileTopArrow: { marginBottom: 10 },
  mobileBottomArrow: { marginTop: 10 },
  arrowUp: {
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
  arrowDown: {
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
});
