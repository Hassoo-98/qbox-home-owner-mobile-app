import { PasswordInput } from "@/components";
import { useProfile } from "@/hooks/useProfile";
import { PasswordFormResolver } from "@/utils";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const Password = () => {
  const { setOnSave } = useProfile();

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
    router.dismissTo("/(app)/(profile)");
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
        placeholder="Enter password"
      />

      <PasswordInput
        name="password"
        control={control}
        label="Password"
        placeholder="Enter password"
      />

      <PasswordInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Enter password"
      />
    </ScrollView>
  );
};

export default Password;
