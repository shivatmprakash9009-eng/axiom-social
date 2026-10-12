import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, motion } from "@/theme/tokens";

type Props = PropsWithChildren<{ scroll?: boolean; style?: ViewStyle }>;
export function Screen({ children, scroll = true, style }: Props) {
  const content = <Animated.View entering={FadeInDown.duration(motion.standard).springify().damping(22)} style={[styles.content, style]}>{children}</Animated.View>;
  if (!scroll) return <View style={styles.root}>{content}</View>;
  return <ScrollView style={styles.root} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{content}</ScrollView>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingBottom: 28 },
  content: { paddingHorizontal: 20, paddingTop: 18, gap: 22 },
});
