import { Text } from "@/components";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  TouchableOpacity,
  View,
} from "react-native";
import { SegmentedControlProps } from "./props";
import { styles } from "./styles";

export const SegmentedControl = ({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps) => {
  const activeIndex = options.findIndex((option) => option.value === value);
  const slideAnim = useRef(new Animated.Value(activeIndex)).current;
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 150,
    }).start();
  }, [activeIndex, slideAnim]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSegmentWidth(width / options.length);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.segmentContainer} onLayout={handleLayout}>
        {/* Animated background indicator */}
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                width: segmentWidth,
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: options.map((_, i) => i),
                      outputRange: options.map((_, i) => i * segmentWidth),
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        {/* Segments */}
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              style={styles.tab}
              onPress={() => onChange(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SegmentedControl;
