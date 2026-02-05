import { BorderRadius, Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: mvs(20),
    },
    segmentedControl: {
        marginVertical: Spacing.md,
        width: "100%",
    },
    searchInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: mvs(8),
        height: mvs(40),
        padding: mvs(10),
        backgroundColor: Colors.background,
        marginBottom: mvs(Spacing.md),
    },
    fab: {
        width: mvs(50),
        height: mvs(50),
        borderRadius: BorderRadius.full,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        position: "absolute",
        right: mvs(20),
        bottom: mvs(50),
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
