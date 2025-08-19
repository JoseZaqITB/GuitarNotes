import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function ConfirmModal({
  visible,
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel} // Handle back button on Android
    >
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    minWidth: 300,
    width: "80%",
    padding: 16,
    backgroundColor: colors.light.primary,
    borderRadius: 8,
    elevation: 5,
  },
  message: {
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
  },
});
