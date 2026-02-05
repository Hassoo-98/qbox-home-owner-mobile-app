import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxxl + Spacing.lg,
    },
    flatList: {
        flexGrow: 0,
    },
    blurContainer: {
        flex: 1,
        padding: Spacing.md,
    },
    successCard: {
        backgroundColor: Colors.white,
        borderRadius: Spacing.md,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        alignItems: "center",
        flexDirection: "row",
        minWidth: 280,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    successTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: mvs(8),
    },
});
