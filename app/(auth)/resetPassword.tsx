import { Button, Form, FormLayout, PasswordInput } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useResetPassword } from "@/hooks/api/useAuthQueries";
import { useModal } from "@/hooks/useModal";
import { ResetPasswordFormResolver } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const ResetPassword = () => {
  const { uid, contact, method } = useLocalSearchParams<{ uid: string, contact: string, method: string }>();
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
        new_password: data.password
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
            title: "Password Reset Successful!",
            primaryButtonText: "Go to Login",
            primaryButtonHandler: handleConfirm,
            secondaryButtonHandler: onCloseModal,
            subtitle: "Your password has been successfully reset. You can now login with your new password.",
          });
          reset();
        },
      }
    );
  });

  return (
    <FormLayout
      title="Create a Secure Password"
      description={`Enter a strong password to secure your account.`}
    >
      <Form style={{ paddingVertical: Spacing.lg }}>
        <PasswordInput
          name="password"
          control={control}
          label="New Password"
          placeholder="Enter new password"
        />
        <PasswordInput
          name="confirmPassword"
          control={control}
          label="Re-type Password"
          placeholder="Re-type password"
        />

        <Button
          style={{ marginTop: Spacing.xl }}
          title="Update"
          disabled={!isValid}
          loading={resetPasswordMutation.isPending}
          onPress={onSubmit}
        />
      </Form>
    </FormLayout>
  );
};

export default ResetPassword;
