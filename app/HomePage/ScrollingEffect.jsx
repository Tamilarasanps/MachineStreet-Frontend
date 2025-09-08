import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";

const ScrollingEffect = ({ width, data }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [shouldScroll, setShouldScroll] = useState(false);

  // Duplicate array for continuous scroll effect if needed
  const items = [...data, ...data]; // duplicate for looping scroll

  useEffect(() => {
    const itemWidth = width / 4; // approximate width per item (adjust if needed)
    const singleContentWidth = data.length * (itemWidth + 8); // margin included

    // Decide if scrolling is needed
    if (singleContentWidth > width) {
      setShouldScroll(true);

      const animate = () => {
        scrollAnim.setValue(0);
        Animated.timing(scrollAnim, {
          toValue: -singleContentWidth,
          duration: 15000,
          useNativeDriver: false,
        }).start(() => animate());
      };
      animate();
    } else {
      setShouldScroll(false);
      scrollAnim.setValue(0);
    }
  }, [data, width, scrollAnim]);

  return (
    <View style={{ width, overflow: "hidden" }}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX: shouldScroll ? scrollAnim : 0 }],
        }}
      >
        {(shouldScroll ? items : data).map((item, index) => (
          <View
            key={index}
            className="bg-neutral-800 px-3 py-1 mx-1 rounded-md"
            style={{ marginHorizontal: 4 }}
          >
            <Text className="text-white text-base">{item}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default ScrollingEffect;
