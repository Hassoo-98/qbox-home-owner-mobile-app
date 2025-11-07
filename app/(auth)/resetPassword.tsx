import { AuthScreenLayout, Button, Form, PasswordInput } from "@/components";
import { Spacing } from "@/constants";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

export const ResetPassword = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("new password submission: ", data);
    router.dismissTo("/login");
  };

  return (
    <AuthScreenLayout
      title="Create a Secure Password"
      description={`Enter a strong password to secure your account.`}
    >
      <Form style={{ paddingTop: Spacing.lg }}>
        <PasswordInput
          name="newPassword"
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
          onPress={handleSubmit(onSubmit)}
        />
      </Form>
    </AuthScreenLayout>
  );
};

export default ResetPassword;
