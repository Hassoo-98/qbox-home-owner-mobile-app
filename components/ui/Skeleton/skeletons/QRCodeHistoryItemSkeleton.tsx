import { Card } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export const QRCodeHistoryItemSkeleton = () => {
    return (
        <Card
            variant="filled"
            showSideBorder
            sideBorderColor={Colors.border}
            style={{ marginBottom: mvs(Spacing.md) }}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Skeleton width="40%" height={20} />
                <Skeleton width={60} height={20} variant="rounded" />
            </View>
            <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
            <Skeleton width="30%" height={12} style={{ marginTop: 12 }} />
        </Card>
    );
};
