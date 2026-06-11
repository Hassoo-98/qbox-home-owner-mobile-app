import { Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useLocale } from "@/hooks";

import { ShareQRCodeButtonProps } from "./props";

export const ShareQRCodeButton = ({
  loading,
  disabled = false,
  onPress,
}: ShareQRCodeButtonProps) => {
  const { t } = useLocale();

  return (
    <Button
      variant="primary"
      icon={<Ionicons name="share-social-outline" size={24} color="white" />}
      title={t("shareQrCode")}
      loading={loading}
      onPress={onPress}
      disabled={disabled}
    />
  );
};
