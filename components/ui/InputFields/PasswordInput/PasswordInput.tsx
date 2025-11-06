import { TextInput } from "@/components";
import React from "react";
import { PasswordInputProps } from "./props";

export const PasswordInput = (props: PasswordInputProps) => {
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  const handlePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  return (
    <TextInput
      {...props}
      secureTextEntry={!isPasswordVisible}
      endIconPath={
        isPasswordVisible
          ? require("@/assets/images/eye.png")
          : require("@/assets/images/eye-slash.png")
      }
      onEndIconClick={handlePasswordVisibility}
    />
  );
};

export default PasswordInput;
