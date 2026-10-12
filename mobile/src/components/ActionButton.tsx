import type { PropsWithChildren } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { PressScale } from "@/components/PressScale";
import { colors, radius } from "@/theme/tokens";
type Props = PropsWithChildren<{ label: string; onPress: () => void; variant?: "primary" | "secondary" | "quiet"; loading?: boolean; disabled?: boolean }>;
export function ActionButton({ label, onPress, variant = "primary", loading, disabled, children }: Props) {
  const primary = variant === "primary";
  const quiet = variant === "quiet";
  return <PressScale onPress={onPress} disabled={disabled || loading} haptic={primary} style={[styles.press, primary ? styles.primary : quiet ? styles.quiet : styles.secondary, (disabled || loading) && styles.disabled]}><View style={styles.row}>{loading ? <ActivityIndicator size="small" color={primary ? colors.canvas : colors.gold} /> : children}<Text style={[styles.label, { color: primary ? colors.canvas : colors.text }]}>{label}</Text></View></PressScale>;
}
const styles = StyleSheet.create({
  press: { borderRadius: radius.control, minHeight: 46, paddingHorizontal: 15, justifyContent: "center", alignItems: "center" },
  primary: { backgroundColor: colors.gold },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  quiet: { backgroundColor: "transparent" },
  disabled: { opacity: 0.48 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  label: { fontSize: 13, fontWeight: "700", letterSpacing: 0.1 },
});
