import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActionButton } from "@/components/ActionButton";
import { PlatformMark } from "@/components/PlatformMark";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors, radius } from "@/theme/tokens";

const activity = [
  { platform: "instagram" as const, title: "Studio launch — Reel", subtitle: "Today · 6:30 PM", status: "Draft", tone: "gold" as const },
  { platform: "youtube" as const, title: "Behind the process", subtitle: "Tomorrow · 11:00 AM", status: "Review", tone: "warning" as const },
];

function Metric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: keyof typeof Ionicons.glyphMap }) {
  return <Surface style={styles.metric}><View style={styles.metricTop}><View style={styles.metricIcon}><Ionicons name={icon} size={16} color={colors.gold} /></View><Ionicons name="open-outline" size={15} color={colors.textMuted} /></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricDetail}>{detail}</Text></Surface>;
}

function ConnectAction({ onPress }: { onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.connectChip}><Text style={styles.connectText}>Connect</Text><Ionicons name="open-outline" size={13} color={colors.gold} /></Pressable>;
}

export default function HomeScreen() {
  return (
    <Screen>
      <ScreenHeader title="Your social, in sync." subtitle="A clearer view of everything that needs your attention."  />
      <Animated.View entering={FadeInDown.delay(70).duration(340)} style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.heroHead}><View style={styles.liveDot} /><Text style={styles.heroEyebrow}>YOUR AI COMMAND CENTER</Text><View style={{ flex: 1 }} /><Ionicons name="sparkles" size={17} color={colors.gold} /></View>
        <Text style={styles.heroTitle}>Make room for{"\n"}your next big idea.</Text>
        <Text style={styles.heroBody}>Plan, create and manage your social presence from one calm workspace.</Text>
        <ActionButton label="Talk to your assistant" onPress={() => router.navigate("/(tabs)/assistant")}><Ionicons name="sparkles" size={17} color={colors.canvas} /></ActionButton>
        <Pressable accessibilityRole="button" onPress={() => router.push("/compose")} style={styles.secondaryAction}><Ionicons name="add" size={16} color={colors.textSecondary} /><Text style={styles.secondaryActionText}>Create a post with your own media</Text></Pressable>
      </Animated.View>
      <View style={styles.metrics}><Metric label="In your planner" value="08" detail="Sample items only" icon="calendar-outline" /><Metric label="Needs your eye" value="02" detail="Sample drafts only" icon="checkmark-circle-outline" /></View>
      <View style={styles.section}>
        <SectionHeading title="Connected accounts" eyebrow="Your channels" action="Manage" onActionPress={() => router.push("/settings")} />
        <Surface style={styles.accounts}>
          <View style={styles.accountRow}><PlatformMark platform="instagram" size={43} /><View style={styles.accountInfo}><Text style={styles.accountTitle}>Instagram</Text><Text style={styles.accountSub}>Professional account</Text></View><ConnectAction onPress={() => router.push("/settings")} /></View>
          <View style={styles.rowDivider} />
          <View style={styles.accountRow}><PlatformMark platform="youtube" size={43} /><View style={styles.accountInfo}><Text style={styles.accountTitle}>YouTube</Text><Text style={styles.accountSub}>Channel management</Text></View><ConnectAction onPress={openSettings} /></View>
          <Text style={styles.demoNote}>Not connected. OAuth is not configured yet; no account data is being accessed.</Text>
        </Surface>
      </View>
      <View style={styles.section}>
        <SectionHeading title="Coming up" eyebrow="Your publishing queue" action="View planner" onActionPress={() => router.navigate("/(tabs)/planner")} />
        <View style={{ gap: 10 }}>{activity.map((item, index) => <Animated.View key={item.title} entering={FadeInDown.delay(120 + index * 70).duration(300)}><Surface style={styles.activity}><PlatformMark platform={item.platform} size={42} /><View style={styles.activityInfo}><Text style={styles.activityTitle}>{item.title}</Text><Text style={styles.activitySub}>{item.subtitle}</Text></View><StatusPill label={item.status} tone={item.tone} /></Surface></Animated.View>)}</View>
        <Text style={styles.demoNote}>Sample content for layout preview. These are not real scheduled posts.</Text>
      </View>
      <View style={styles.footerHint}><Ionicons name="shield-checkmark-outline" size={15} color={colors.textMuted} /><Text style={styles.footerText}>Every action stays visible. You stay in control.</Text></View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  hero: { overflow: "hidden", borderRadius: radius.large, padding: 20, gap: 14, backgroundColor: "#171713", borderWidth: 1, borderColor: "rgba(215,185,130,0.18)" },
  heroGlow: { position: "absolute", top: -80, right: -60, width: 230, height: 230, borderRadius: 120, backgroundColor: "rgba(215,185,130,0.06)" },
  heroHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  heroEyebrow: { fontSize: 10, letterSpacing: 1.2, color: colors.gold, fontWeight: "800" },
  heroTitle: { color: colors.text, fontSize: 29, lineHeight: 33, letterSpacing: -1.1, fontWeight: "600", marginTop: 3 },
  heroBody: { fontSize: 13, lineHeight: 20, color: colors.textSecondary, maxWidth: 280, marginBottom: 5 },
  secondaryAction: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, paddingVertical: 4 },
  secondaryActionText: { fontSize: 11, color: colors.textSecondary, fontWeight: "600" },
  metrics: { flexDirection: "row", gap: 10 },
  metric: { flex: 1, gap: 5, padding: 14, minHeight: 139 },
  metricTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  metricValue: { color: colors.text, fontSize: 27, lineHeight: 31, fontWeight: "600", letterSpacing: -0.7 },
  metricLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "600" },
  metricDetail: { color: colors.textMuted, fontSize: 10 },
  section: { gap: 12 },
  accounts: { padding: 13, gap: 13 },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  accountInfo: { flex: 1, gap: 3 },
  accountTitle: { color: colors.text, fontSize: 13, fontWeight: "600" },
  accountSub: { color: colors.textMuted, fontSize: 11 },
  connectChip: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 9, backgroundColor: colors.goldSoft },
  connectText: { color: colors.gold, fontSize: 10, fontWeight: "700" },
  rowDivider: { height: 1, backgroundColor: colors.border },
  activity: { flexDirection: "row", alignItems: "center", gap: 11, padding: 12 },
  activityInfo: { flex: 1, gap: 4 },
  activityTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  activitySub: { color: colors.textMuted, fontSize: 10 },
  demoNote: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 1 },
  footerHint: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 4 },
  footerText: { color: colors.textMuted, fontSize: 10 },
});
