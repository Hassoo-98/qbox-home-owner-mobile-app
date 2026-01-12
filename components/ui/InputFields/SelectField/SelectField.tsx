import { ChevronDownIcon } from "@/assets/icons";
import { Text } from "@/components";
import React from "react";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SelectFieldProps } from "./props";
import { styles } from "./styles";

export const SelectField = ({
  name,
  label,
  options = [],
  control,
  iconPath,
  endAdornment,
  placeholder = "Select an option",
  disabled = false,
  style,
  containerStyle,
  ...restProps
}: SelectFieldProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          {iconPath && (
            <Image source={{ uri: iconPath }} style={styles.labelIcon} />
          )}
          <Text size="sm" style={styles.label}>
            {label}
          </Text>
          {endAdornment && (
            <View style={styles.endAdornment}>{endAdornment}</View>
          )}
        </View>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Dropdown
              data={options}
              labelField="label"
              valueField="value"
              placeholder={placeholder}
              placeholderStyle={styles.placeholderStyle}
              value={value}
              onChange={(item) => onChange(item.value)}
              disable={disabled}
              style={[styles.dropdown, style, error && styles.dropdownError]}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              itemContainerStyle={styles.itemContainerStyle}
              activeColor="#F4F5F6"
              maxHeight={200}
              renderRightIcon={() => <ChevronDownIcon height={15} width={15} />}
              {...restProps}
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

export default SelectField;
