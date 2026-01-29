import { Colors } from '@/constants';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { SkeletonProps } from './props';

export const Skeleton = ({
    width = '100%',
    height = 20,
    variant = 'rect',
    style
}: SkeletonProps) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.7, { duration: 1000 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const borderRadius =
        variant === 'circle' ? (typeof height === 'number' ? height / 2 : 50) :
            variant === 'rounded' ? 8 : 0;

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height: height as any,
                    borderRadius,
                    backgroundColor: Colors.border || '#E1E1E1',
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});

export default Skeleton;
