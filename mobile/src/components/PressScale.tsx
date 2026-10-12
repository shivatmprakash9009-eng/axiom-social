import { useCallback } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { motion } from "@/theme/tokens";

type Props = Omit<PressableProps, "style"> & { style?: ViewStyle; haptic?: boolean };
export function PressScale({ children, style, onPress, haptic = false, disabled, ...props }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handlePress = useCallback<NonNullable<PressableProps["onPress"]>>((event) => {
    if (disabled) return;
    if (haptic) void Haptics.selectionAsync().catch(() => undefined);
    onPress?.(event);
  }, [disabled, haptic, onPress]);
  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable accessibilityRole="button" disabled={disabled} onPressIn={() => { scale.value = withSpring(0.975, motion.spring); }} onPressOut={() => { scale.value = withSpring(1, motion.spring); }} onPress={handlePress} {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
