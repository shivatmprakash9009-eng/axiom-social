import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/theme/tokens";
type Tone = "success" | "warning" | "neutral" | "gold";
type Props = { label: string; tone?: Tone };
const palette = {
  success: { foreground: colors.success, background: "rgba(131,201,161,0.10)" },
  warning: { foreground: colors.warning, background: "rgba(230,189,114,0.10)" },
  neutral: { foreground: colors.textSecondary, background: "rgba(255,255,255,0.055)" },
  gold: { foreground: colors.gold, background: colors.goldSoft },
};
export function StatusPill({ label, tone = "neutral" }: Props) {
  const color = palette[tone];
  return <View style={[styles.pill, { backgroundColor: color.background }]}><View style={[styles.dot, { backgroundColor: color.foreground }]} /><Text style={[styles.label, { color: color.foreground }]}>{label}</Text></View>;
}
const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.2 },
});
