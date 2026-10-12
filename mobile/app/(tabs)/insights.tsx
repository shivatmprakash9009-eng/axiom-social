import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PlatformMark } from "@/components/PlatformMark";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { Surface } from "@/components/Surface";
import { colors } from "@/theme/tokens";

const periods = ["7 days", "30 days", "90 days"] as const;
const bars = [28, 42, 35, 61, 48, 72, 55];
export default function InsightsScreen() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("7 days");
  return (
    <Screen>
      <ScreenHeader title="Signal over noise." subtitle="Understand what resonates and decide what to try next." />
      <Surface style={styles.dataNotice}><Ionicons name="information-circle-outline" size={17} color={colors.gold} /><Text style={styles.dataNoticeText}>Preview dashboard. Metrics below are illustrative, not from connected accounts.</Text></Surface>
      <View style={styles.periods}>{periods.map(value => <Text key={value} onPress={() => setPeriod(value)} style={[styles.period, period === value && styles.periodActive]}>{value}</Text>)}</View>
      <View style={styles.metrics}>
        {[{ label: "Reach", value: "—", change: "Awaiting account data", icon: "eye-outline" as const }, { label: "Engagement", value: "—", change: "Awaiting account data", icon: "heart-outline" as const }].map((item, i) => <Animated.View entering={FadeInDown.delay(i * 65).duration(260)} key={item.label} style={{ flex: 1 }}><Surface style={styles.metric}><View style={styles.metricIcon}><Ionicons name={item.icon} size={17} color={colors.gold} /></View><Text style={styles.metricValue}>{item.value}</Text><Text style={styles.metricLabel}>{item.label}</Text><Text style={styles.metricSub}>{item.change}</Text></Surface></Animated.View>)}
      </View>
      <SectionHeading title="Publishing cadence" eyebrow={period} />
      <Surface style={styles.chart}>
        <View style={styles.chartTop}><Text style={styles.chartTitle}>Activity by day</Text><Text style={styles.chartTag}>SAMPLE ONLY</Text></View>
        <View style={styles.bars}>{bars.map((height, i) => <View key={i} style={styles.barColumn}><View style={styles.barTrack}><View style={[styles.barFill, { height: `${height}%` }]} /></View><Text style={styles.barLabel}>{["M","T","W","T","F","S","S"][i]}</Text></View>)}</View>
        <Text style={styles.chartFoot}>Connect accounts to replace this illustration with authorized API metrics.</Text>
      </Surface>
      <SectionHeading title="Platform signals" eyebrow="Connected channels" />
      <Surface style={styles.platformRow}><PlatformMark platform="instagram" size={42} /><View style={styles.platformCopy}><Text style={styles.platformTitle}>Instagram</Text><Text style={styles.platformSub}>Reach, interactions and eligible account insights</Text></View><Ionicons name="lock-closed-outline" size={15} color={colors.textMuted} /></Surface>
      <Surface style={styles.platformRow}><PlatformMark platform="youtube" size={42} /><View style={styles.platformCopy}><Text style={styles.platformTitle}>YouTube</Text><Text style={styles.platformSub}>Views, watch time and channel analytics where authorized</Text></View><Ionicons name="lock-closed-outline" size={15} color={colors.textMuted} /></Surface>
    </Screen>
  );
}
const styles = StyleSheet.create({
  dataNotice: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  dataNoticeText: { color: colors.textSecondary, flex: 1, fontSize: 10, lineHeight: 15 },
  periods: { flexDirection: "row", alignSelf: "flex-start", gap: 4, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  period: { color: colors.textMuted, fontSize: 10, fontWeight: "600", overflow: "hidden", borderRadius: 9, paddingHorizontal: 11, paddingVertical: 7 },
  periodActive: { color: colors.gold, backgroundColor: colors.goldSoft },
  metrics: { flexDirection: "row", gap: 10 },
  metric: { gap: 7, minHeight: 132, padding: 14 },
  metricIcon: { height: 31, width: 31, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldSoft },
  metricValue: { color: colors.text, fontSize: 25, fontWeight: "600" },
  metricLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "600" },
  metricSub: { color: colors.textMuted, fontSize: 9, lineHeight: 13 },
  chart: { gap: 16 },
  chartTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chartTitle: { color: colors.text, fontSize: 13, fontWeight: "600" },
  chartTag: { color: colors.textMuted, letterSpacing: 1, fontSize: 8, fontWeight: "800" },
  bars: { flexDirection: "row", height: 135, gap: 11 },
  barColumn: { flex: 1, alignItems: "center", gap: 8 },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.035)", borderRadius: 7 },
  barFill: { width: "100%", backgroundColor: colors.gold, borderRadius: 7, opacity: 0.85 },
  barLabel: { color: colors.textMuted, fontSize: 9 },
  chartFoot: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  platformRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13 },
  platformCopy: { flex: 1, gap: 4 },
  platformTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  platformSub: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
});
