import { Colors } from "@/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    expiryText: {
        color: Colors.white,
    },
    planText: {
        fontWeight: "600",
        color: Colors.white,
    },
    buttonText: {
        color: Colors.secondary,
    },
});
