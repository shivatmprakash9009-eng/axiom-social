import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { router } from "expo-router";
import { ActionButton } from "@/components/ActionButton";
import { PlatformMark } from "@/components/PlatformMark";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors } from "@/theme/tokens";

type Item = { id: string; platform: "instagram" | "youtube"; title: string; time: string; status: "Draft" | "Review" | "Scheduled"; day: number };
const items: Item[] = [
  { id: "1", platform: "instagram", title: "Studio launch — Reel", time: "6:30 PM", status: "Draft", day: 12 },
  { id: "2", platform: "youtube", title: "Behind the process", time: "11:00 AM", status: "Review", day: 14 },
  { id: "3", platform: "instagram", title: "A look behind the scenes", time: "5:00 PM", status: "Scheduled", day: 16 },
];
const week = [{ day:"MON",date:12 },{ day:"TUE",date:13 },{ day:"WED",date:14 },{ day:"THU",date:15 },{ day:"FRI",date:16 },{ day:"SAT",date:17 },{ day:"SUN",date:18 }];

export default function PlannerScreen() {
  const [selected, setSelected] = useState(12);
  const [filter, setFilter] = useState<"All" | "Instagram" | "YouTube">("All");
  const filtered = useMemo(() => items.filter(item => item.day === selected && (filter === "All" || item.platform === filter.toLowerCase())), [selected, filter]);
  return (
    <Screen>
      <ScreenHeader title="Your next move." subtitle="A considered plan for everything you publish." />
      <Surface style={styles.summary}><View style={styles.summaryIcon}><Ionicons name="calendar-outline" size={20} color={colors.gold} /></View><View style={{ flex: 1, gap: 3 }}><Text style={styles.summaryTitle}>Your publishing rhythm</Text><Text style={styles.summarySub}>Review drafts, then choose when each post goes live.</Text></View></Surface>
      <View style={styles.weekWrap}>
        <SectionHeading title="October" eyebrow="Weekly view" action="Today" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.week}>
          {week.map(item => { const active = item.date === selected; return (
            <Animated.View key={item.date} layout={Layout.springify().damping(24)}>
              <Text accessibilityRole="button" accessibilityLabel={`${item.day}, October ${item.date}`} onPress={() => setSelected(item.date)} style={[styles.dateItem, active && styles.dateActive]}>
                <Text style={[styles.dateDay, active && styles.dateTextActive]}>{item.day}</Text>{"\n"}
                <Text style={[styles.dateNumber, active && styles.dateTextActive]}>{item.date}</Text>{"\n"}
                <Text style={[styles.dateDot, { opacity: [12,14,16].includes(item.date) ? 1 : 0 }]}>•</Text>
              </Text>
            </Animated.View>
          ); })}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <SectionHeading title={`${filtered.length} items`} eyebrow="Selected day" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(["All", "Instagram", "YouTube"] as const).map(value => <Text key={value} onPress={() => setFilter(value)} style={[styles.filter, filter === value && styles.filterActive]}>{value}</Text>)}
        </ScrollView>
        {filtered.length ? filtered.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.delay(index * 55).duration(260)}>
            <Surface style={styles.post}><PlatformMark platform={item.platform} size={44} /><View style={styles.postInfo}><Text style={styles.postTitle}>{item.title}</Text><Text style={styles.postTime}>{item.time} · {item.platform === "instagram" ? "Instagram" : "YouTube"}</Text><View style={{ alignSelf: "flex-start", marginTop: 5 }}><StatusPill label={item.status} tone={item.status === "Scheduled" ? "success" : item.status === "Review" ? "warning" : "gold"} /></View></View><Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} /></Surface>
          </Animated.View>
        )) : (
          <Surface style={styles.empty}><Ionicons name="sunny-outline" size={24} color={colors.gold} /><Text style={styles.emptyTitle}>Space to create.</Text><Text style={styles.emptyBody}>No items match this day and filter. Start with a fresh idea.</Text><ActionButton label="Create content" onPress={() => router.push("/compose")} variant="secondary" /></Surface>
        )}
      </View>
      <Text style={styles.note}>Preview content only. Connect platform accounts and configure a server-side scheduler before real publishing.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  summary: { flexDirection: "row", gap: 12, alignItems: "center", padding: 15 },
  summaryIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldSoft },
  summaryTitle: { color: colors.text, fontSize: 13, fontWeight: "600" },
  summarySub: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  weekWrap: { gap: 15 },
  week: { gap: 8, paddingRight: 20 },
  dateItem: { width: 45, height: 79, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, textAlign: "center", paddingTop: 11, color: colors.text, overflow: "hidden" },
  dateActive: { backgroundColor: colors.goldSoft, borderColor: "rgba(215,185,130,0.55)" },
  dateDay: { color: colors.textMuted, fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  dateNumber: { color: colors.text, fontSize: 16, fontWeight: "700" },
  dateTextActive: { color: colors.gold },
  dateDot: { color: colors.gold, fontSize: 10, lineHeight: 10 },
  section: { gap: 12 },
  filters: { gap: 8, paddingRight: 20 },
  filter: { borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, overflow: "hidden", color: colors.textSecondary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, fontSize: 11, fontWeight: "600" },
  filterActive: { color: colors.gold, backgroundColor: colors.goldSoft, borderColor: "rgba(215,185,130,0.45)" },
  post: { flexDirection: "row", alignItems: "center", gap: 11, padding: 12 },
  postInfo: { flex: 1, gap: 4 },
  postTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  postTime: { color: colors.textMuted, fontSize: 10 },
  empty: { alignItems: "center", padding: 22, gap: 12 },
  emptyTitle: { color: colors.text, fontWeight: "600", fontSize: 17 },
  emptyBody: { color: colors.textMuted, fontSize: 12, textAlign: "center", lineHeight: 18 },
  note: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
});
