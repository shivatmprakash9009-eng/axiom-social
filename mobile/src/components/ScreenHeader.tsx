import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/tokens";

type Props = { label?: string; title: string; subtitle?: string; onPressSettings?: () => void };

export function ScreenHeader({ label = "AXIOM SOCIAL", title, subtitle, onPressSettings }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.top}>
        <View style={styles.brand}>
          <View style={styles.symbol}>
            <Ionicons name="aperture" size={22} color={colors.gold} />
          </View>
          <Text style={styles.brandName}>{label === "AXIOM SOCIAL" ? "AXIOM\nSOCIAL" : label}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Search AXIOM" onPress={() => router.push("/search")} style={styles.actionButton}>
            <Ionicons name="search-outline" size={21} color={colors.textSecondary} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push("/notifications")} style={styles.actionButton}>
            <Ionicons name="notifications-outline" size={21} color={colors.textSecondary} />
          </Pressable>
          {onPressSettings ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={onPressSettings} style={styles.actionButton}>
              <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
            </Pressable>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel="Open navigation drawer" onPress={() => router.push("/drawer")} style={styles.actionButton}>
              <Ionicons name="menu" size={25} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 27,
    paddingHorizontal: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 52,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  symbol: {
    height: 42,
    width: 42,
    borderRadius: 14,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(215,185,130,0.28)",
  },
  brandName: {
    color: colors.text,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1.65,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    gap: 7,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
