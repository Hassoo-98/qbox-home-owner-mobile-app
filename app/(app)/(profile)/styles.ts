import { mvs } from "@/utils/metrices";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "center",
        paddingHorizontal: mvs(20),
        paddingBottom: mvs(30),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    maintenanceText: {
        marginVertical: mvs(20),
    },
});
