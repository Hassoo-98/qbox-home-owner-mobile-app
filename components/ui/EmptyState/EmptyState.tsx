import { Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { EmptyStateProps } from "./props";
import { styles } from "./styles";

export const EmptyState = ({
    title,
    description,
    iconName = "alert-circle-outline",
    containerStyle,
    style,
    titleStyle,
    descriptionStyle,
}: EmptyStateProps) => {
    return (
        <View style={[styles.container, containerStyle, style]}>
            {iconName && (
                <Ionicons
                    name={iconName}
                    size={mvs(64)}
                    color={Colors.primary}
                    style={styles.icon}
                />
            )}
            <Text
                variant="default"
                size="lg"
                bold
                style={[styles.title, titleStyle]}
            >
                {title}
            </Text>
            <Text
                variant="default"
                size="md"
                color={Colors.gray}
                style={[styles.description, descriptionStyle]}
            >
                {description}
            </Text>
        </View>
    );
};
