import React, { useRef } from "react";
import { Pressable, Animated } from "react-native";

export default function ScalePressable({
  children,
  onPress,
  style,
  scaleTo = 0.95,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (toValue) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateScale(scaleTo)}
      onPressOut={() => animateScale(1)}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
