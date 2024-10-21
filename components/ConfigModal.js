import { Image, Pressable, View } from "react-native";
import MyText from "./MyText";
import penIcon from "../assets/pen.png";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";

export default function ConfigModal({
  title,
  author,
  scrollDuration,
  setScrollDuration,
}) {
  return (
    <View
      style={{
        position: "absolute",
        minWidth: 200,
        minHeight: 200,
        width: "50%",
        height: "30%",
        backgroundColor: "rgba(0, 103, 152, 1)",

        padding: 8,
        bottom: 64 + 64,
        right: 20 + 64 + 16,
        borderRadius: 8,
        elevation: 24,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MyText>Key </MyText>
        <Pressable>
          <MyText>G</MyText>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MyText>Edit Song </MyText>
        <Link href={`/add/${title}-${author}`} asChild>
          <Pressable>
            <Image source={penIcon} width={18} height={18} />
          </Pressable>
        </Link>
      </View>
      <View style={{}}>
        <View>
          <MyText>Autoscroll speed </MyText>
          <MyText>{GetMinFromMil(scrollDuration)}</MyText>
        </View>
        <Slider
          style={{ width: 200, height: 40 }}
          step={1}
          value={scrollDuration}
          minimumValue={1000} // milliseconds
          maximumValue={1000 * 60 * 8} // millisecons * seconds * minutes
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => setScrollDuration(value)}
        />
      </View>
    </View>
  );
}

// functions
function GetMinFromMil(miliseconds) {
  const total_seconds = Math.floor(miliseconds / 1000);
  const total_minutes = Math.floor(total_seconds / 60);
  const seconds = total_seconds % 60;
  const minutes = total_minutes % 60;
  return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
}
