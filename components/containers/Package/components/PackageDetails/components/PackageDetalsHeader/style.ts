import { BorderRadius } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  packageImage: {
    width: mvs(85),
    height: mvs(85),
    borderRadius: mvs(BorderRadius.xs),
  },
});
