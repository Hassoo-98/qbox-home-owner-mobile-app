import { Card } from "@/components";
import { Colors, Spacing } from "@/constants";
import { Dimensions, View } from "react-native";
import { Skeleton } from "../Skeleton";

const { width: screenWidth } = Dimensions.get("window");

export const QRSettingSkeleton = () => {
    const imageWidth = screenWidth * 0.25;

    return (
        <Card
            backgroundColor={Colors.darkGray}
            variant="filled"
            borderRadius={Spacing.sm + 4}
            style={{
                marginVertical: Spacing.md,
                padding: 0,
                width: "100%",
            }}
        >
            <View style={{ padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <Skeleton width={60} height={16} style={{ marginBottom: 4 }} />
                    <Skeleton width={120} height={20} style={{ marginBottom: Spacing.sm }} />
                    <Skeleton width="80%" height={24} />
                </View>
                <Skeleton width={imageWidth} height={imageWidth} variant="rounded" style={{ borderRadius: 8 }} />
            </View>

            <View style={{ padding: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: Spacing.md }} />
                <Skeleton width="100%" height={50} variant="rounded" style={{ marginBottom: Spacing.md }} />
                <Skeleton width="100%" height={50} variant="rounded" />
            </View>
        </Card>
    );
};
