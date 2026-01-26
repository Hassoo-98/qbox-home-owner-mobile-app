import { Card } from "@/components";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../Skeleton";

export const ProfileSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Profile Card Skeleton */}
            <View style={styles.profileInfo}>
                <Skeleton width={80} height={80} variant="circle" style={{ marginBottom: 12 }} />
                <Skeleton width="50%" height={24} style={{ marginBottom: 8 }} />
                <Skeleton width="60%" height={16} style={{ marginBottom: 4 }} />
                <Skeleton width="40%" height={14} />
            </View>

            {/* Subscription Card Skeleton */}
            <Card variant="filled" style={{ height: 80, marginVertical: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
                        <Skeleton width="70%" height={18} />
                    </View>
                    <Skeleton width={80} height={32} variant="rounded" style={{ borderRadius: 8 }} />
                </View>
            </Card>

            {/* Menu List Skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.menuItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Skeleton width={24} height={24} variant="rounded" style={{ marginRight: 12 }} />
                        <Skeleton width="60%" height={18} />
                    </View>
                    <Skeleton width={16} height={16} variant="rounded" />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
    },
    profileInfo: {
        alignItems: "center",
        paddingVertical: 20,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: mvs(16),
        borderBottomWidth: 1,
        borderBottomColor: "#F4F4F4",
    },
});
