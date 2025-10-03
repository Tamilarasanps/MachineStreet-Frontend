import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export default function SplashScreen({ onAnimationComplete }) {
  const scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(-80); // Start further left for bigger logo

  useEffect(() => {
    // Initial delay before starting animation
    setTimeout(() => {
      // Smooth logo scale to 1.5
      scale.value = withTiming(1.5, { duration: 800, easing: Easing.out(Easing.exp) }, () => {
        // Fade in and slide text
        textOpacity.value = withTiming(1, { duration: 500 });
        textTranslate.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) }, () => {
          // Fade out after delay
          setTimeout(() => {
            textOpacity.value = withTiming(0, { duration: 500 });
            scale.value = withTiming(0, { duration: 500 }, () => {
              if (onAnimationComplete) runOnJS(onAnimationComplete)();
            });
          }, 1000);
        });
      });
    }, 300); // Delay of 300ms before logo animation starts
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslate.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 120, height: 120 }}
        />
      </Animated.View>
      <Animated.Text style={[styles.text, textStyle]}>
        MachineStreet
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#051829",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFBF00",
    letterSpacing: 1,
  },
});
