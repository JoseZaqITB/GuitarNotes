import { Image, Pressable, View } from "react-native";
import MyText from "./MyText";
import penIcon from "../assets/pen.png";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";

export default function ConfigModal() {
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
        <Link href={"/add/CreateView"} asChild>
          <Pressable>
            <Image source={penIcon} width={18} height={18} />
          </Pressable>
        </Link>
      </View>
      <View style={{}}>
        <MyText>Autoscroll speed </MyText>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
    </View>
  );
}
