import { Button, Form, FormLayout, PasswordInput } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { useModal } from "@/hooks/useModal";
import { ResetPasswordFormResolver } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const ResetPassword = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: ResetPasswordFormResolver,
    mode: "onChange",
  });
  const { onTriggerModal, onCloseModal } = useModal();

  const handleConfirm = () => {
    router.navigate("/(auth)");
    onCloseModal();
  };

  const onSubmit = handleSubmit((data: any) => {
    console.log("new password submission: ", data);

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
      title: "Your request has been submitted for approval.",
      primaryButtonText: "Confirm",
      primaryButtonHandler: handleConfirm,
      secondaryButtonHandler: onCloseModal,
      subtitle: "Once approved, we’ll send you confirmation email.",
    });
    reset();
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
          onPress={onSubmit}
        />
      </Form>
    </FormLayout>
  );
};

export default ResetPassword;
