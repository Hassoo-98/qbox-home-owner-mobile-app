import { Card } from "@/components";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Dimensions, View } from "react-native";
import { Skeleton } from "../Skeleton";

const { width: screenWidth } = Dimensions.get("window");

export const OfferSkeleton = () => {
    return (
        <Card
            backgroundColor="transparent"
            variant="filled"
            borderRadius={Spacing.sm + 4}
            style={{
                marginTop: Spacing.md,
                width: screenWidth - 64,
                marginRight: Spacing.md,
            }}
            contentStyle={{ padding: 0, position: "relative" }}
        >
            <Skeleton
                width={screenWidth - 32}
                height={200}
                variant="rounded"
            />
            <View
                style={{
                    backgroundColor: "rgba(14, 16, 19, 0.4)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: mvs(8),
                    borderBottomLeftRadius: Spacing.sm + 4,
                    borderBottomRightRadius: Spacing.sm + 4,
                }}
            >
                <View style={{ flex: 1, marginRight: 12 }}>
                    <Skeleton width="60%" height={20} style={{ marginBottom: 4 }} />
                    <Skeleton width="90%" height={12} style={{ marginBottom: 4 }} />
                    <Skeleton width="40%" height={12} />
                </View>
                <Skeleton width={60} height={24} variant="rounded" style={{ borderRadius: 100 }} />
            </View>
        </Card>
    );
};
