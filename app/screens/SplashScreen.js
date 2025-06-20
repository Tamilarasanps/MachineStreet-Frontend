import React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, View, Image, Text } from "react-native";

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function SplashScreen() {
  const sv = useSharedValue(0);

  React.useEffect(() => {
    // highlight-next-line
    sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <Image
          source={require("../assests/machine/AppLogo 1.png")}
          style={{ width: 120, height: 120 }}
        />
      </Animated.View>
      <Text className=" text-xl font-bold" style={{ color: "#FFBF00" }}>
        MachineStreet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#051829",
  },
  box: {
    height: 120,
    width: 120,
    // backgroundColor: "#b58df1",
    borderRadius: 20,
  },
});
