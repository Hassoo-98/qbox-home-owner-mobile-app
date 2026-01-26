import { ViewStyle } from 'react-native';

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    variant?: 'rect' | 'circle' | 'rounded';
    style?: ViewStyle;
}
