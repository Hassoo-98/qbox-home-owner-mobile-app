import { Text } from "@/components";
import { mvs } from "@/utils/metrices";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SelectFieldProps } from "./props";
import { styles } from "./style";

export const CustomDropdown = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  search = false,
  searchPlaceholder = "Search...",
  maxHeight = mvs(200),
  disabled = false,
  error,
  required = false,
  dropdownStyle,
  containerStyle,
}: SelectFieldProps<T>) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError },
        }) => (
          <>
            <Dropdown
              data={options}
              labelField="label"
              valueField="value"
              placeholder={placeholder}
              value={value}
              onChange={(item) => onChange(item.value)}
              style={[
                styles.dropdown,
                dropdownStyle,
                (error || fieldError) && styles.dropdownError,
                disabled && styles.dropdownDisabled,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              itemContainerStyle={styles.itemContainerStyle}
              maxHeight={maxHeight}
              search={search}
              searchPlaceholder={searchPlaceholder}
              disable={disabled}
              dropdownPosition="auto"
            />

            {(error || fieldError) && (
              <Text style={styles.errorText}>
                {error || fieldError?.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};
