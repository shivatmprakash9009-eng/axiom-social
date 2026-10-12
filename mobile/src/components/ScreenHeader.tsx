import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/tokens";

type Props = { label?: string; title: string; subtitle?: string; onPressSettings?: () => void };
export function ScreenHeader({ label = "AXIOM SOCIAL", title, subtitle, onPressSettings }: Props) {
  const settingsControl = (
    <View style={styles.settings}>
      <Ionicons name="options-outline" size={19} color={colors.textSecondary} />
    </View>
  );
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.brand}>
          <View style={styles.symbol}><Ionicons name="aperture" size={19} color={colors.gold} /></View>
          <Text style={styles.brandName}>{label}</Text>
        </View>
        {onPressSettings ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={onPressSettings}>
            {settingsControl}
          </Pressable>
        ) : settingsControl}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 27 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  symbol: { height: 32, width: 32, borderRadius: 11, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(215,185,130,0.2)" },
  brandName: { color: colors.text, fontSize: 12, letterSpacing: 1.35, fontWeight: "800" },
  settings: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  copy: { gap: 6 },
  title: { fontSize: 32, fontWeight: "600", color: colors.text, letterSpacing: -1.2, lineHeight: 37 },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
});
