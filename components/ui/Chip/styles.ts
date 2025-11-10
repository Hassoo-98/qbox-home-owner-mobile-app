import { Colors } from "@/constants";
import { StyleSheet } from "react-native";
import { ChipSizeConfig, ChipVariantConfig } from "./props";

export const chipVariants: Record<string, ChipVariantConfig> = {
  default: {
    backgroundColor: Colors.darkGray,
    textColor: Colors.primary,
  },
  warning: {
    backgroundColor: Colors.warning,
    textColor: Colors.warningText,
  },
  info: {
    backgroundColor: "#6155F51A",
    textColor: "#6155F5",
  },
  success: {
    backgroundColor: Colors.success,
    textColor: Colors.white,
  },
  error: {
    backgroundColor: "#E2464A",
    textColor: Colors.white,
  },
};

export const chipSizes: Record<string, ChipSizeConfig> = {
  small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    borderRadius: 12,
  },
  medium: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    borderRadius: 16,
  },
  large: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 20,
  },
};

export const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
});
