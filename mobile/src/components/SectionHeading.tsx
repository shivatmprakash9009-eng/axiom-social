import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/tokens";
type Props = { title: string; eyebrow?: string; action?: string };
export function SectionHeading({ title, eyebrow, action }: Props) {
  return <View style={styles.row}><View style={styles.copy}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}<Text style={styles.title}>{title}</Text></View>{action ? <Text style={styles.action}>{action}</Text> : null}</View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  copy: { gap: 4, flexShrink: 1 },
  eyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 1.6, color: colors.textMuted },
  title: { color: colors.text, fontSize: 21, fontWeight: "600", letterSpacing: -0.6 },
  action: { color: colors.gold, fontSize: 12, fontWeight: "600", paddingBottom: 3 },
});
