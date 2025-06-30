import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import MyText from "../components/MyText";
import ScalePressable from "./ScalePressable";

export default function ListItem({ title, author }) {
  const router = useRouter();
  const handlePress = () => {
    router.push(`/song/${title}-${author}`);
  };
  return (
    <ScalePressable style={styles.basicContainer} onPress={handlePress}>
      <MyText style={titleStyle}>{title}</MyText>
      <MyText style={textStyle}>{author}</MyText>
    </ScalePressable>
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
