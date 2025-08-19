import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import createImg from "../assets/create.png";
import { Link } from "expo-router";
import { defaultStyles } from "../style/defaultStyles";
import ImportView from "./ImportView";

export default function AddView() {
  return (
    <View style={styles.mainContainer}>
      <Link href="/add/SongEditor" asChild>
        <Pressable>
          <Image source={createImg} style={styles.image} />
          <Text style={title}>Create</Text>
        </Pressable>
      </Link>
      <ImportView />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 180,
    height: 180,
  },
  text: {
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
  },
});

const title = StyleSheet.compose(defaultStyles.title, styles.text);
