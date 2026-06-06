import { Button, Form, FormLayout, PasswordInput } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useLocale, useModal } from "@/hooks";
import { useResetPassword } from "@/hooks/api/useAuthQueries";
import { ResetPasswordFormResolver } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const ResetPassword = () => {
  const { t } = useLocale();
  const { contact, method } = useLocalSearchParams<{ uid: string; contact: string; method: string }>();
  const { control, handleSubmit, reset, formState: { isValid } } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: ResetPasswordFormResolver,
    mode: "onChange",
  });
  const { onTriggerModal, onCloseModal } = useModal();
  const resetPasswordMutation = useResetPassword();

  const handleConfirm = () => {
    router.dismissTo("/(auth)");
    onCloseModal();
  };

  const onSubmit = handleSubmit((data: any) => {
    resetPasswordMutation.mutate(
      {
        [method === "phone" ? "phone_number" : "email"]: contact,
        new_password: data.password,
      },
      {
        onSuccess: () => {
          onTriggerModal({
            icon: (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: BorderRadius.full,
                  backgroundColor: Colors.success,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Ionicons size={22} name="checkmark-sharp" color={Colors.white} />
              </View>
            ),
            title: t("passwordResetSuccessful"),
            primaryButtonText: t("goToLogin"),
            primaryButtonHandler: handleConfirm,
            secondaryButtonHandler: onCloseModal,
            subtitle: t("passwordResetSubtitle"),
          });
          reset();
        },
      }
    );
  });

  return (
    <FormLayout
      title={t("createSecurePassword")}
      description={t("enterStrongPassword")}
    >
      <Form style={{ paddingVertical: Spacing.lg }}>
        <PasswordInput
          name="password"
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

        <Button
          style={{ marginTop: Spacing.xl }}
          title={t("update")}
          disabled={!isValid}
          loading={resetPasswordMutation.isPending}
          onPress={onSubmit}
        />
      </Form>
    </FormLayout>
  );
};

export default ResetPassword;
