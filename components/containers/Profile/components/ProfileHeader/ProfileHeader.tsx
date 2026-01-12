import { Button } from "@/components";
import { useProfile } from "@/hooks/useProfile";
import React from "react";

export const ProfileHeader = () => {
  const { onSave } = useProfile();
  return (
    <Button title="Save" variant="transparent" onPress={onSave || undefined} />
  );
};
