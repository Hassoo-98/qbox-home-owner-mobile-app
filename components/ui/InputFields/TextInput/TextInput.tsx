import { Button, Text } from "@/components";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Image,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInputProps } from "./props";
import { styles } from "./styles";

export const TextInput = ({
  name,
  label,
  control,
  iconPath,
  endIcon,
  startIcon,
  endIconPath,
  startIconPath,
  endButtonProps,
  onEndIconClick,
  onStartIconClick,
  endButtonText,
  onEndButtonClick,
  placeholder,
  width,
  ...restProps
}: TextInputProps) => {
  return (
    <View style={[styles.container, { width: width ? width : "100%" }]}>
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
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              {/* Support both icon components and image paths */}
              {(startIcon || startIconPath) && (
                <TouchableOpacity
                  onPress={onStartIconClick}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  {startIcon ? (
                    startIcon
                  ) : (
                    <Image source={startIconPath} style={styles.inputIcon} />
                  )}
                </TouchableOpacity>
              )}

              <RNTextInput
                {...restProps}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#777E90"
                style={[
                  styles.input,
                  (startIcon || startIconPath) && styles.inputWithStartIcon,
                  (endIcon || endIconPath || endButtonText) &&
                    styles.inputWithEndIcon,
                  restProps.multiline && {
                    height: 120,
                    textAlignVertical: "top",
                    paddingTop: 12,
                  },
                ]}
              />

              {/* Support both icon components and image paths */}
              {(endIcon || endIconPath) && (
                <TouchableOpacity
                  onPress={onEndIconClick}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  {endIcon ? (
                    endIcon
                  ) : (
                    <Image source={endIconPath} style={styles.inputIcon} />
                  )}
                </TouchableOpacity>
              )}

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

export default TextInput;
