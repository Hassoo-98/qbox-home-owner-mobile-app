import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        marginTop: Spacing.md,
        marginRight: Spacing.md,
    },
    content: {
        padding: 0,
        position: "relative",
    },
    image: {
        height: 200,
        borderRadius: Spacing.sm + 4,
    },
    overlay: {
        backgroundColor: "rgba(14, 16, 19, 0.8)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: mvs(8),
        borderBottomLeftRadius: Spacing.sm + 4,
        borderBottomRightRadius: Spacing.sm + 4,
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontWeight: "bold",
        color: "white",
        fontSize: mvs(16),
        marginBottom: 4,
    },
    description: {
        color: "white",
        lineHeight: 18,
        fontSize: mvs(12),
    },
    button: {
        borderRadius: 100,
    },
});
