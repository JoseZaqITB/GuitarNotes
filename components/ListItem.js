import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import MyText from "../components/MyText";

export default function ListItem({ title, author }) {
  return (
    <Link
      href={`/song/${title}-${author}`}
      style={styles.basicContainer}
      asChild
    >
      <Pressable>
        <MyText style={titleStyle}>{title}</MyText>
        <MyText style={textStyle}>{author}</MyText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  basicContainer: {
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
  },
  basicText: {
    textAlign: "left",
    marginHorizontal: 16,
    textTransform: "capitalize",
  },
});

const titleStyle = StyleSheet.flatten(defaultStyles.title, styles.basicText);
const textStyle = StyleSheet.flatten(
  defaultStyles.middleText,
  styles.basicText,
);
