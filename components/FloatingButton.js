import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default class FloatingButton extends React.Component {
  render() {
    const { onPress, style, children } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.fab,
          ...style,
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 41, 83, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 24,
  },
});
