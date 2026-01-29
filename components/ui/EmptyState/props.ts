import { Ionicons } from "@expo/vector-icons";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface EmptyStateProps {
    title: string;
    description: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
}
