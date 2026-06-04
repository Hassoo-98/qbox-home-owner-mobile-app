import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "center",
        paddingHorizontal: mvs(16),
        paddingTop: mvs(12),
        paddingBottom: mvs(20),
        gap: mvs(12),
    },
});
