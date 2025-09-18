import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const FadeSlideView = ({
  children,
  style,
  delay = 0,
  duration = 400,
  initialVisible = false, // new prop
}) => {
  const fadeAnim = useRef(new Animated.Value(initialVisible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(initialVisible ? 0 : 20)).current;

  useEffect(() => {
    if (initialVisible) return; // skip animation if already visible

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay, duration, initialVisible]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          zIndex: 999,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeSlideView;
