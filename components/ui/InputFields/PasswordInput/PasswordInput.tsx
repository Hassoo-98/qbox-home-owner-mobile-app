import { TextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { PasswordInputProps } from "./props";

export const PasswordInput = (props: PasswordInputProps) => {
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  const handlePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  return (
    <TextInput
      {...props}
      secureTextEntry={!isPasswordVisible}
      endIcon={
        <Ionicons
          name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
          size={24}
          color="#777E90"
        />
      }
      onEndIconClick={handlePasswordVisibility}
    />
  );
};

export default PasswordInput;
