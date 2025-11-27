import { PasswordInput } from "@/components";
import { mvs } from "@/utils/metrices";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const Password = () => {
  const { control } = useForm({
    defaultValues: {
      password: "",
      oldPassword: "",
      comfirmPassword: "",
    },
  });

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
