import { Button, Text } from "@/components";
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
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
  defaultCode: propDefaultCode,
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
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          let extractedValue = value;
          let activeDefaultCode: any = propDefaultCode || "US";

          if (value && value.startsWith("+")) {
            try {
              const phoneNumber = parsePhoneNumberWithError(value);
              if (phoneNumber) {
                // If we have a valid E.164 number, we extract the national number
                // for the input display and use the country code for the picker.
                extractedValue = phoneNumber.nationalNumber;
                activeDefaultCode = phoneNumber.country as CountryCode;
              }
            } catch (err) {
              // If parsing fails (e.g. incomplete number), we just pass it as is
              console.log("Phone parsing error in PhoneNumberInput:", err);
            }
          }

          return (
            <>
              <View style={styles.phoneInputWrapper}>
                <PhoneInput
                  ref={phoneInput}
                  value={extractedValue}
                  onChangeFormattedText={onChange}
                  defaultCode={activeDefaultCode}
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
          );
        }}
      />
    </View>
  );
};

export default PhoneNumberInput;
