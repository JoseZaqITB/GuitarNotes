import { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";

export default class MyText extends Component {
  render() {
    const { children, style } = this.props;
    return <Text style={[styles.container, style]}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
  },
});
