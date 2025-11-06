import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { FormProps } from "./props";
import { styles } from "./styles";

export const Form = ({
  children,
  style,
  keyboardShouldPersistTaps = "handled",
  showsVerticalScrollIndicator = false,
  ...restProps
}: FormProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={[styles.form, style]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...restProps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
