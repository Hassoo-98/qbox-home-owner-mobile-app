import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: mvs(Spacing.xl),
    },
    icon: {
        marginBottom: mvs(Spacing.md),
    },
    title: {
        marginBottom: mvs(Spacing.sm),
        textAlign: "center",
    },
    description: {
        textAlign: "center",
    },
});
