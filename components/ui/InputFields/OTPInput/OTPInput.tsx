import { Text } from "@/components";
import React from "react";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { OTPInputProps } from "./props";
import { styles } from "./styles";

export const OTPInput = ({
  name,
  label,
  control,
  iconPath,
  numberOfDigits = 6,
  rules,
}: OTPInputProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          {iconPath && (
            <Image source={{ uri: iconPath }} style={styles.labelIcon} />
          )}
          <Text size="sm" style={styles.label}>
            {label}
          </Text>
        </View>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <OtpInput
              numberOfDigits={numberOfDigits}
              onTextChange={(text) => {
                onChange(text);
              }}
              focusColor="#6B7A8F"
              focusStickBlinkingDuration={500}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: error
                  ? styles.digitBoxError
                  : styles.digitBox,
                pinCodeTextStyle: styles.digitText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.digitBoxFocused,
                filledPinCodeContainerStyle: styles.digitBoxFilled,
              }}
            />

            {error && (
              <Text size="xs" variant="danger" style={styles.errorText}>
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default OTPInput;
