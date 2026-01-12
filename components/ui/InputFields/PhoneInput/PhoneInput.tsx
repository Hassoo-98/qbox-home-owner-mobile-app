import { Button, Text } from "@/components";
import React, { useRef } from "react";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { PhoneInputProps } from "./props";
import { styles } from "./styles";

export const PhoneNumberInput = ({
  name,
  label,
  control,
  iconPath,
  placeholder = "Enter phone number",
  endButtonText,
  onEndButtonClick,
  endButtonProps,
  ...restProps
}: PhoneInputProps) => {
  const phoneInput = useRef<PhoneInput>(null);

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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <View style={styles.phoneInputWrapper}>
              <PhoneInput
                ref={phoneInput}
                value={value}
                onChangeFormattedText={onChange}
                defaultCode="US"
                layout="second"
                placeholder={placeholder}
                containerStyle={[
                  styles.phoneInputContainer,
                  error && styles.phoneInputContainerError,
                ]}
                textContainerStyle={styles.phoneInputTextContainer}
                textInputStyle={styles.phoneInputText}
                codeTextStyle={styles.phoneInputCodeText}
                flagButtonStyle={styles.phoneInputCountryPickerButton}
                textInputProps={{
                  placeholderTextColor: "#777E90",
                }}
                {...restProps}
              />
              {endButtonText && (
                <Button
                  onPress={onEndButtonClick}
                  size="sm"
                  {...endButtonProps}
                  title={endButtonText}
                />
              )}
            </View>

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

export default PhoneNumberInput;
