import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  timelineContainer: {
    marginTop: mvs(15),
    marginBottom: mvs(30),
  },
  timelineTitle: {
    marginBottom: mvs(10),
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: mvs(8),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableBorder: {
    borderWidth: 0,
  },
  headerRow: {
    height: mvs(50),
    backgroundColor: "#2C4A5C",
    paddingHorizontal: mvs(10),
  },
  headerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: mvs(13),
    textAlign: "left",
  },
  dataRow: {
    minHeight: mvs(60),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(12),
  },
  rowText: {
    fontSize: mvs(12),
    color: "#333",
    textAlign: "left",
  },
});
