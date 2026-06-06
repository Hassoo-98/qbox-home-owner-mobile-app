import { PasswordInput } from "@/components";
import { useLocale, useProfile } from "@/hooks";
import { useChangePassword } from "@/hooks/api/useAuthQueries";
import { PasswordFormResolver } from "@/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const Password = () => {
  const { t } = useLocale();
  const { setOnSave } = useProfile();
  const changePasswordMutation = useChangePassword();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: PasswordFormResolver,
    mode: "onChange",
  });

  const onSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate({
      old_password: data.oldPassword,
      new_password: data.newPassword,
    });
  });

  useEffect(() => {
    setOnSave(() => onSubmit);
    return () => setOnSave(null);
  }, [onSubmit, setOnSave]);

  return (
    <View>
      <PasswordInput
        name="oldPassword"
        control={control}
        label={t("password")}
        placeholder={t("password")}
      />
      <PasswordInput
        name="newPassword"
        control={control}
        label={t("newPassword")}
        placeholder={t("enterNewPassword")}
      />
      <PasswordInput
        name="confirmPassword"
        control={control}
        label={t("retypePassword")}
        placeholder={t("enterConfirmPassword")}
      />
    </View>
  );
};

export default Password;
