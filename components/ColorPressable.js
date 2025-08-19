import { useRef } from "react";
import { Pressable, Animated, StyleSheet } from "react-native";
import { colors } from "../style/defaultStyles";

export default function ColorPressable({ onPress, children, style }) {
  const animation = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue) => {
    animation.stopAnimation(); // prevent animation from continuing
    Animated.timing(animation, {
      toValue,
      duration: 200, // milliseconds
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", colors.light.secondary], // normal -> pressed color
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
    >
      <Animated.View style={[styles.button, { backgroundColor }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 0,
    borderRadius: 10,
    alignItems: "center",
  },
});
