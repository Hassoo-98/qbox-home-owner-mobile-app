import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";

export const QRGenerationSuccessCard = () => {
  return (
    <Card
      backgroundColor={Colors.successBackground}
      variant="filled"
      borderRadius={Spacing.sm}
      style={{
        marginTop: Spacing.md,
        justifyContent: "center",
      }}
      contentStyle={{
        paddingVertical: Spacing.xs,
        paddingBottom: Spacing.md,
      }}
    >
      <Text variant="success" style={{ fontWeight: "bold" }}>
        Note:{" "}
        <Text variant="success" style={{ fontWeight: "normal" }}>
          Note: This includes your QBOX image, live location, QR code, and a
          tutorial GIF. Share it with your delivery driver to ensure secure
          locker access.
        </Text>
      </Text>
    </Card>
  );
};
