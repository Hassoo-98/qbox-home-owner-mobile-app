import { Card } from "@/components";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../Skeleton";

export const PackageItemSkeleton = () => {
    return (
        <Card variant="filled" style={styles.packageCard}>
            <View style={styles.cardContent}>
                <Skeleton width={mvs(40)} height={mvs(40)} variant="circle" />
                <View style={styles.packageInfo}>
                    <View style={styles.titleRow}>
                        <Skeleton width="50%" height={20} />
                        <Skeleton width={60} height={20} variant="rounded" />
                    </View>
                    <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
                    <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
                    <Skeleton width="30%" height={12} style={{ marginTop: 8 }} />
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    packageCard: {
        marginBottom: mvs(Spacing.sm),
        width: "100%",
    },
    cardContent: {
        flexDirection: "row",
        gap: mvs(12),
    },
    packageInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
