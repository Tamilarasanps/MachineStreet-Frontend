import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";

const ScrollingEffect = ({ width }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [shouldScroll, setShouldScroll] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  // static data
  const items = ["Apple", "Banana", "Orange", "Mango", "Grapes", "Peach"];

  useEffect(() => {
    if (contentWidth > width) {
      setShouldScroll(true);

      const animate = () => {
        scrollAnim.setValue(0);
        Animated.timing(scrollAnim, {
          toValue: -contentWidth / 2, // scroll across one copy
          duration: 15000,
          useNativeDriver: true,
        }).start(() => animate());
      };

      animate();
    } else {
      setShouldScroll(false);
      scrollAnim.setValue(0);
    }
  }, [width, contentWidth]);

  return (
    <View style={{ width, overflow: "hidden" }}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX: shouldScroll ? scrollAnim : 0 }],
        }}
        onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}
      >
        {/* duplicate once for seamless scroll */}
        {[...items, ...items].map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#222",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              marginHorizontal: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>{item}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default ScrollingEffect;
