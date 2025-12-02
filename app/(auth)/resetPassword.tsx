import { Button, Form, FormLayout, PasswordInput } from "@/components";
import { Spacing } from "@/constants";
import { ResetPasswordFormResolver } from "@/utils";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

export const ResetPassword = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: ResetPasswordFormResolver,
    mode: "onChange",
  });

  const onSubmit = handleSubmit((data: any) => {
    console.log("new password submission: ", data);
    router.dismissTo("/login");
  });

  return (
    <FormLayout
      title="Create a Secure Password"
      description={`Enter a strong password to secure your account.`}
    >
      <Form style={{ paddingTop: Spacing.lg }}>
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
