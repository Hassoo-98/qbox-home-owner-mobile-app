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
  endIconPath,
  startIconPath,
  onEndIconClick,
  onStartIconClick,
  endButtonText,
  onEndButtonClick,
  placeholder,
  ...restProps
}: TextInputProps) => {
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
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              {startIconPath && (
                <TouchableOpacity
                  onPress={onStartIconClick}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Image source={startIconPath} style={styles.inputIcon} />
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
                  startIconPath && styles.inputWithStartIcon,
                  (endIconPath || endButtonText) && styles.inputWithEndIcon,
                ]}
              />

              {endIconPath && (
                <TouchableOpacity
                  onPress={onEndIconClick}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Image source={endIconPath} style={styles.inputIcon} />
                </TouchableOpacity>
              )}

              {endButtonText && (
                <Button
                  onPress={onEndButtonClick}
                  size="sm"
                  title={endButtonText}
                />
                // <TouchableOpacity
                //   onPress={onEndButtonClick}
                //   style={styles.endButton}
                //   // activeOpacity={0.8}
                // >
                //   <Text size="md" style={styles.endButtonText}>
                //     {endButtonText}
                //   </Text>
                // </TouchableOpacity>
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
