import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { CustomSwitchProps } from "./props";

export const CustomSwitch = ({ value, onValueChange, disabled = false }: CustomSwitchProps) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbPointer = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.primary, Colors.danger],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [mvs(4), mvs(50)],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (!disabled) {
          onValueChange(!value);
        }
      }}
      disabled={disabled}
    >
      <Animated.View style={[styles.track]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
            { backgroundColor: thumbPointer },
            disabled ? { opacity: 0.6 } : null,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: mvs(75),
    height: mvs(32),
    borderRadius: mvs(16),
    justifyContent: "center",
    paddingHorizontal: mvs(10),
    position: "relative",
    backgroundColor: Colors.white,
  },

  leftLabel: {
    position: "absolute",
    left: mvs(12),
    justifyContent: "center",
    height: "100%",
  },

  rightLabel: {
    position: "absolute",
    right: mvs(12),
    justifyContent: "center",
    height: "100%",
  },

  labelText: {
    color: Colors.white,
    fontWeight: "600",
  },

  thumb: {
    position: "absolute",
    width: mvs(20),
    height: mvs(20),
    borderRadius: mvs(13),
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
