import { Modal, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { DeleteSongByidAsync } from "../hooks/songList";
import { colors, defaultStyles } from "../style/defaultStyles";
import ScalePressable from "./ScalePressable";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ConfigModal({
  id,
  scrollDuration,
  setScrollDuration,
  onClose,
  selectedTone,
  setSelectedTone,
  visible,
}) {
  const minValue = 1000; // 1 second
  const maxValue = 1000 * 60 * 8; // 8 minutes
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  /**
   * functions
   */
  const handlePress = () => {
    onClose();
    router.push(`/add/${id}`);
  };
  const handleDeleteSong = () => {
    DeleteSongByidAsync(id).catch((error) => alert(error));
    setModalVisible(false);
    router.navigate("/");
  };
  const handleValueChange = (value) => {
    const realValue = value;
    setScrollDuration(realValue);
  };

  const getFrac = (decimal) => {
    if (Number.isInteger(decimal / 2)) {
      if (decimal > 0) return `+${decimal / 2}`;
      return decimal / 2;
    } else if (decimal > 0) return ` +${Math.round(decimal / 2)}/2 `;
    else return ` ${Math.floor(decimal / 2)}/2 `;
  };
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // Ha  ndle back button on Android
    >
      <View style={{ flex: 1 }}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.dialogBox}>
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MyText style={styles.sectionTitle}>Key </MyText>
                <View style={styles.toneWrapper}>
                  <ScalePressable
                    style={styles.toneBtn}
                    onPress={() => setSelectedTone((prev) => prev - 1)}
                  >
                    <FontAwesome5
                      name={"minus-circle"}
                      size={24}
                      color={colors.light.textPrimary}
                    />
                  </ScalePressable>
                  <MyText style={styles.toneText}>
                    {getFrac(selectedTone)}
                  </MyText>
                  <ScalePressable
                    style={styles.toneBtn}
                    onPress={() => setSelectedTone((prev) => prev + 1)}
                  >
                    <FontAwesome5
                      name={"plus-circle"}
                      size={24}
                      color={colors.light.textPrimary}
                    />
                  </ScalePressable>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <MyText style={styles.sectionTitle}>Edit Song </MyText>
                <View style={styles.btnWrapper}>
                  <ScalePressable onPress={handlePress}>
                    <FontAwesome5
                      name="pen"
                      size={20}
                      color={colors.light.textPrimary}
                    />
                  </ScalePressable>
                  <ScalePressable
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <FontAwesome5 name="trash" size={20} color={"#900D09"} />
                  </ScalePressable>
                </View>
              </View>
              <View style={{ marginVertical: 4 }}>
                <MyText style={styles.sectionTitle}>Autoscroll Duration</MyText>
                <View style={styles.sliderWrapper}>
                  <Slider
                    step={1000}
                    value={scrollDuration}
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
        </Pressable>
      </View>
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
    elevation: 0,
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
  toneText: {
    alignSelf: "center",
    textAlign: "center",
    minWidth: 48,
  },
  toneWrapper: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 16,
  },
});
