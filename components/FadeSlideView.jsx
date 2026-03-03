import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
const FadeSlideView = ({ children, style, delay = 0, duration = 400, visible = true }) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 20,
        duration,
        delay,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible, fadeAnim, slideAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }], zIndex: 999 },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeSlideView;
