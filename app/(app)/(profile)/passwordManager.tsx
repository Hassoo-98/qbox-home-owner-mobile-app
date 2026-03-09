import { PasswordInput } from "@/components";
import { useChangePassword } from "@/hooks/api/useAuthQueries";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { PasswordFormResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const Password = () => {
  const { setOnSave } = useProfile();
  const { user } = useAuth();
  const changePasswordMutation = useChangePassword();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      oldPassword: "",
      confirmPassword: "",
    },
    resolver: PasswordFormResolver,
    mode: "onChange",
  });

  const onSubmit = handleSubmit((data) => {
    console.log("this is password form data", data);
    changePasswordMutation.mutate({
      id: user?.id as string,
      old_password: data.oldPassword,
      new_password: data.password,
    });
  });

  useEffect(() => {
    setOnSave(() => onSubmit);

    return () => setOnSave(null);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        padding: mvs(20),
      }}
    >
      <PasswordInput
        name="oldPassword"
        control={control}
        label="Password"
        placeholder="Enter old password"
      />

      <PasswordInput
        name="password"
        control={control}
        label="New Password"
        placeholder="Enter new password"
      />

      <PasswordInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Enter confirm password"
      />
    </ScrollView>
  );
};

export default Password;
