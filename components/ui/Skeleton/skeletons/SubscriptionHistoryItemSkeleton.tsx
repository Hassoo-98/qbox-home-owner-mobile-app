import { Card } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export const SubscriptionHistoryItemSkeleton = () => {
    return (
        <Card
            variant="filled"
            showSideBorder
            sideBorderColor={Colors.success}
            style={{ marginBottom: mvs(Spacing.md) }}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Skeleton width="40%" height={20} />
                <Skeleton width="20%" height={20} />
            </View>
            <Skeleton width="30%" height={14} style={{ marginTop: 8 }} />
            <Skeleton width="60%" height={12} style={{ marginTop: 8 }} />
            <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />

            <Skeleton width="100%" height={40} variant="rounded" style={{ marginTop: 12, borderRadius: 8 }} />
        </Card>
    );
};
