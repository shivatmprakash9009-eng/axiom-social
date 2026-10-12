import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radius } from "@/theme/tokens";

type Props = PropsWithChildren<{ style?: ViewStyle; elevated?: boolean }>;
export function Surface({ children, style, elevated = false }: Props) {
  return <View style={[styles.surface, elevated && styles.elevated, style]}>{children}</View>;
}
const styles = StyleSheet.create({
  surface: { borderRadius: radius.card, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  elevated: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderStrong },
});
