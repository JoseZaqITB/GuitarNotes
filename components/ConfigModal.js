import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MyText from "./MyText";
import Slider from "@react-native-community/slider";
import { Link, router } from "expo-router";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { DeleteSongByidAsync } from "../hooks/songList";
import { colors, defaultStyles } from "../style/defaultStyles";
import ScalePressable from "./ScalePressable";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ConfigModal({
  id,
  title,
  author,
  scrollDuration,
  setScrollDuration,
  onClose,
  visible,
}) {
  const minValue = 1000; // 1 second
  const maxValue = 1000 * 60 * 8; // 8 minutes
  const reversedValue = maxValue - scrollDuration + minValue; // Reverse the value so left = max, right = min
  const [modalVisible, setModalVisible] = useState(false);
  const handleDeleteSong = () => {
    DeleteSongByidAsync(id).catch((error) => alert(error));
    setModalVisible(false);
    router.navigate("/");
  };
  const handleValueChange = (value) => {
    const realValue = maxValue - value + minValue;
    setScrollDuration(realValue);
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
                <MyText style={styles.sectionTitle}>Edit Song </MyText>
                <View style={styles.btnWrapper}>
                  <Link href={`/add/${title}-${author}`} asChild>
                    <ScalePressable onPress={onClose}>
                      <FontAwesome5
                        name="pen"
                        size={20}
                        color={colors.light.textPrimary}
                      />
                    </ScalePressable>
                  </Link>
                  <ScalePressable
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <FontAwesome5 name="trash" size={20} color={"#900D09"} />
                  </ScalePressable>
                </View>
              </View>
              <View style={{ marginVertical: 4 }}>
                <MyText style={styles.sectionTitle}>Autoscroll speed </MyText>
                <View style={styles.sliderWrapper}>
                  <Slider
                    step={1000}
                    value={reversedValue}
                    minimumValue={minValue} // milliseconds
                    maximumValue={maxValue} // millisecons * seconds * minutes
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={handleValueChange}
                  />
                  <MyText style={styles.sliderText}>
                    {GetMinFromMil(scrollDuration)}
                  </MyText>
                </View>
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
  sliderWrapper: { marginVertical: 4 },
  sliderText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    ...defaultStyles.middleText,
    fontWeight: "bold",
  },
  btnWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 16,
  },
});
