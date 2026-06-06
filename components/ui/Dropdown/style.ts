import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    marginBottom: mvs(16),
  },
  label: {
    marginBottom: mvs(8),
    fontSize: mvs(14),
    fontWeight: "500",
    color: "#333",
  },
  required: {
    color: "#FF3B30",
  },
  dropdown: {
    height: mvs(50),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: mvs(8),
    paddingHorizontal: mvs(12),
    backgroundColor: "#FFF",
  },
  dropdownError: {
    borderColor: "#FF3B30",
  },
  dropdownDisabled: {
    backgroundColor: "#E9EDF3",
    borderColor: "#D5DCE8",
    opacity: 1,
  },
  placeholderStyle: {
    fontSize: mvs(14),
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: mvs(14),
    color: "#000",
  },
  itemTextStyle: {
    fontSize: mvs(14),
    color: "#000",
  },
  itemContainerStyle: {
    paddingVertical: mvs(2),
  },
  errorText: {
    fontSize: mvs(12),
    color: "#FF3B30",
    marginTop: mvs(4),
  },
});
