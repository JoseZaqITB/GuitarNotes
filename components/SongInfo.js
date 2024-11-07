import { StyleSheet, TextInput, View } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import MyText from "./MyText";

function CustomInput({ name, defaultValue }) {
  return (
    <View style={styles.inputContainer}>
      <MyText style={title}>{name}</MyText>
      <TextInput
        defaultValue={defaultValue}
        placeholder="My best Song"
        placeholderTextColor={colors.light.textSecondary}
        style={styles.text}
      />
    </View>
  );
}

export default function SongInfo({ title, author, tag }) {
  return (
    <View style={styles.mainContainer}>
      <CustomInput name={"Title"} defaultValue={title} />
      <CustomInput name={"Author"} defaultValue={author} />
      <CustomInput name={"Tag"} defaultValue={tag} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 64, // adjust center problem because of the header height
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
    margin: 16,
  },
  text: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    margin: 4,
  },
  title: {
    fontWeight: "bold",
    ...defaultStyles.title,
  },
});

const title = StyleSheet.compose(styles.text, styles.title);
