import { Text } from "@/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerModalProps } from "./props";

export const DatePickerModal = ({
  visible,
  date,
  onClose,
  onChange,
}: DatePickerModalProps) => {
  if (Platform.OS === "ios") {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.modalButton, styles.doneButton]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              maximumDate={new Date()}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Android
  if (visible) {
    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        maximumDate={new Date()}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  doneButton: {
    fontWeight: "600",
  },
});
