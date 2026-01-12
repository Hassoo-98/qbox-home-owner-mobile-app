import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: mvs(15),
    gap: mvs(10),
  },
  attributeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: mvs(5),
    justifyContent: "space-between",
  },
});
