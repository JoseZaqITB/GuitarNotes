import { StyleSheet, TextInput, View } from "react-native";
import MyText from "./MyText";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function LabelInput({ name, defaultValue, placeholder, state }) {
  return (
    <View style={styles.inputContainer}>
      <MyText style={titleStyle}>{name}</MyText>
      <TextInput
        defaultValue={defaultValue}
        placeholder={placeholder || "My best Song"}
        placeholderTextColor={colors.light.textSecondary}
        onChangeText={state}
        style={styles.customInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
    margin: 16,
  },
  customInput: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    width: "100%",
    marginHorizontal: 8,
  },
});
const titleStyle = StyleSheet.flatten(styles.title, styles.text);
