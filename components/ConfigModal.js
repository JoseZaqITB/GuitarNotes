import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MyText from "./MyText";
import penIcon from "../assets/pen.png";
import trashIcon from "../assets/trash.png";
import Slider from "@react-native-community/slider";
import { Link, router } from "expo-router";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { DeleteSongByidAsync } from "../hooks/songList";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function ConfigModal({
  id,
  title,
  author,
  scrollDuration,
  setScrollDuration,
  onClose,
  visible,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const handleDeleteSong = () => {
    DeleteSongByidAsync(id).catch((error) => alert(error));
    setModalVisible(false);
    router.navigate("/");
  };
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // Ha  ndle back button on Android
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.dialogBox}>
            <View
              style={{
                flex: 1,
              }}
            >
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MyText>Key </MyText>
            <Pressable>
              <MyText>G</MyText>
            </Pressable>
          </View> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <MyText style={defaultStyles.middleText}>Edit Song: </MyText>
                <Link href={`/add/${title}-${author}`} asChild>
                  <Pressable>
                    <Image source={penIcon} width={18} height={18} />
                  </Pressable>
                </Link>
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                  <Image
                    source={trashIcon}
                    width={28}
                    height={28}
                    tintColor={"red"}
                    style={{ width: 28, height: 28 }}
                  />
                </Pressable>
              </View>
              <View style={{ marginVertical: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <MyText style={defaultStyles.middleText}>
                    Autoscroll speed:{" "}
                  </MyText>
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
          </View>
          <ConfirmModal
            visible={modalVisible}
            message="Do you really wanna delete the song?"
            onConfirm={handleDeleteSong}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// functions
function GetMinFromMil(miliseconds) {
  const total_seconds = Math.floor(miliseconds / 1000);
  const total_minutes = Math.floor(total_seconds / 60);
  const seconds = total_seconds % 60;
  const minutes = total_minutes % 60;
  return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`; // could be more simplified
}

// styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 36,
  },
  dialogBox: {
    flexDirection: "row",
    backgroundColor: colors.light.primary,
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
});
