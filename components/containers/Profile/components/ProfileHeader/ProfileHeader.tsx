import { Button } from "@/components";
import { useLocale } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import React from "react";

export const ProfileHeader = () => {
  const { onSave, isSaving } = useProfile();
  const { t } = useLocale();
  return (
    <Button
      title={isSaving ? t("saving") : t("save")}
      variant="transparent"
      onPress={onSave || undefined}
      loading={isSaving}
      disabled={isSaving}
    />
  );
};
