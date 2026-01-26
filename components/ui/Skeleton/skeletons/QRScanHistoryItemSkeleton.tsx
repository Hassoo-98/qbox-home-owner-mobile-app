import { Card } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export const QRScanHistoryItemSkeleton = () => {
    return (
        <Card
            variant="filled"
            showSideBorder
            sideBorderColor={Colors.border}
            style={{ marginBottom: mvs(Spacing.md) }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: Colors.border2,
                    paddingBottom: mvs(Spacing.sm),
                }}
            >
                <Skeleton width="40%" height={20} />
                <Skeleton width={60} height={20} variant="rounded" />
            </View>

            <View style={{ paddingVertical: mvs(Spacing.sm) }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Skeleton width="30%" height={16} />
                    <Skeleton width="40%" height={16} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Skeleton width="30%" height={16} />
                    <Skeleton width="40%" height={16} />
                </View>
            </View>

            <Skeleton width="100%" height={40} variant="rounded" style={{ marginTop: 12, borderRadius: 8 }} />
        </Card>
    );
};
