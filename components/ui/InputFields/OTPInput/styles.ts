import { BorderRadius, Colors, Spacing } from "@/constants";
import { width as SCREEN_WIDTH } from "@/utils/metrices";
import { StyleSheet } from "react-native";

// Calculate responsive box size
// Screen width minus padding and gaps, divided by number of digits (6)
// Modal padding (Spacing.md * 2) + Container padding (20 * 2) = 32 + 40 = 72
const CONTAINER_PADDING = 80; // Increased slightly for safety
const GAPS = Spacing.sm * 5; // 8 * 5 = 40
const AVAILABLE_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING - GAPS;
const DIGIT_BOX_SIZE = Math.min(Math.floor(AVAILABLE_WIDTH / 6), 46);

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.md,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs + 2,
  },

  labelIcon: {
    width: 20,
    height: 20,
    marginRight: Spacing.xs,
  },

  label: {
    fontSize: 14,
  },

  otpContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },

  digitBox: {
    backgroundColor: "#FCFCFD",
    borderWidth: 1.5,
    borderColor: "#E6E8EC",
    borderRadius: BorderRadius.md,
    height: DIGIT_BOX_SIZE,
    width: DIGIT_BOX_SIZE,
  },

  digitBoxFocused: {
    borderColor: "#6B7A8F",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },

  digitBoxError: {
    borderColor: Colors.danger,
    borderWidth: 1.5,
  },

  digitBoxFilled: {
    borderColor: "#6B7A8F",
    backgroundColor: "#FFFFFF",
  },

  digitText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  focusStick: {
    backgroundColor: "#6B7A8F",
    height: 24,
    width: 2,
  },

  errorText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
