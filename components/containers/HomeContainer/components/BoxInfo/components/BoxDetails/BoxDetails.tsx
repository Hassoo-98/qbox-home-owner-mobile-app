import { Button, Chip, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { View } from "react-native";
import { BoxDetailsProps } from "./props";

export const BoxDetails = ({ address, noOfPackages }: BoxDetailsProps) => {
  const { t } = useLocale();

  return (
    <View>
      <Text size="md" style={{ marginBottom: Spacing.sm }}>
        {address || t("address")}
      </Text>
      <Chip
        label={`${noOfPackages || 1} ${t("package")} ${t("inside")}`}
        backgroundColor={Colors.primary}
        textColor={Colors.white}
        size="small"
        style={{ marginBottom: Spacing.md }}
      />

      <View style={{ flexDirection: "row", gap: Spacing.xs }}>
        <Button
          title={t("openBox")}
          size="xs"
          style={{ backgroundColor: Colors.white }}
          textStyle={{ color: Colors.primary }}
        />
        <Button
          title={t("liveView")}
          size="xs"
          style={{ backgroundColor: Colors.white }}
          textStyle={{ color: Colors.primary }}
        />
      </View>
    </View>
  );
};
