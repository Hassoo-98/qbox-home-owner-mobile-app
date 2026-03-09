import { Card, ItemInfo } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Dimensions, View } from "react-native";
import { Skeleton } from "../Skeleton";

const { width: screenWidth } = Dimensions.get("window");

export const BoxInfoSkeleton = () => {
    const imageWidth = screenWidth * 0.35;

    return (
        <Card
            backgroundColor={Colors.darkGray}
            variant="filled"
            borderRadius={Spacing.sm + 4}
            style={{
                width: "100%",
            }}
        >
            <ItemInfo
                title="Box ID"
                description=""
                style={{
                    padding: 0,
                }}
                leftContent={
                    <View>
                        <Skeleton width={150} height={20} style={{ marginBottom: Spacing.sm }} />
                        <Skeleton width={120} height={24} variant="rounded" style={{ marginBottom: Spacing.md }} />
                        <View style={{ flexDirection: "row", gap: Spacing.xs }}>
                            <Skeleton width={80} height={32} variant="rounded" />
                            <Skeleton width={80} height={32} variant="rounded" />
                        </View>
                    </View>
                }
                rightContent={
                    <View style={{ marginLeft: Spacing.sm, alignItems: 'flex-end' }}>
                        <Skeleton width={60} height={24} variant="rounded" style={{ marginBottom: mvs(8) }} />
                        <Skeleton width={imageWidth} height={imageWidth} variant="rounded" style={{ top: 15, right: -15 }} />
                    </View>
                }
            />
        </Card>
    );
};
