import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors } from "@/theme/tokens";

const threads = [
  { id: "1", platform: "instagram" as const, name: "Maya W.", time: "12m", text: "Would this work for a small team?", type: "Comment", tone: "warning" as const },
  { id: "2", platform: "youtube" as const, name: "Jordan Lee", time: "48m", text: "Could you make a tutorial about the setup?", type: "Comment", tone: "gold" as const },
  { id: "3", platform: "instagram" as const, name: "Studio North", time: "2h", text: "Love the direction of this launch.", type: "Comment", tone: "success" as const },
];
export default function InboxScreen() {
  const [filter, setFilter] = useState<"All" | "Instagram" | "YouTube">("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const visible = threads.filter(t => filter === "All" || t.platform === filter.toLowerCase());
  return (
    <Screen>
      <ScreenHeader title="Conversations, gathered." subtitle="Review supported engagement without jumping between apps." />
      <Surface style={styles.notice}><Ionicons name="shield-checkmark-outline" size={17} color={colors.gold} /><Text style={styles.noticeText}>Examples only. Live comments and messages require approved platform permissions.</Text></Surface>
      <View style={styles.filters}>{(["All", "Instagram", "YouTube"] as const).map(item => <Text key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>{item}</Text>)}</View>
      <SectionHeading title="Needs attention" eyebrow={`${visible.length} sample threads`} />
      <View style={{ gap: 10 }}>
        {visible.map((thread, index) => <Animated.View key={thread.id} entering={FadeInDown.delay(index * 55).duration(260)}>
          <Surface style={styles.thread}>
            <View style={[styles.avatar, { backgroundColor: thread.platform === "instagram" ? "rgba(214,162,185,0.12)" : "rgba(240,138,135,0.12)" }]}><Ionicons name={thread.platform === "instagram" ? "logo-instagram" : "logo-youtube"} size={18} color={thread.platform === "instagram" ? colors.instagram : colors.youtube} /></View>
            <View style={styles.threadBody}>
              <View style={styles.threadTop}><Text style={styles.name}>{thread.name}</Text><Text style={styles.time}>{thread.time}</Text></View>
              <Text style={styles.context}>{thread.platform === "instagram" ? "Instagram" : "YouTube"} · {thread.type}</Text>
              <Text style={styles.text}>{thread.text}</Text>
              <View style={styles.threadBottom}><StatusPill label="AI draft available" tone={thread.tone} /><Text onPress={() => setSelected(selected === thread.id ? null : thread.id)} style={styles.replyAction}>{selected === thread.id ? "Close" : "Draft reply"}</Text></View>
              {selected === thread.id ? <View style={styles.replyBox}><Text style={styles.replyDraft}>Thanks for reaching out — happy to share more context. What would be most useful for you?</Text><Text style={styles.replyAction} onPress={() => setDrafts(previous => ({ ...previous, [thread.id]: "Draft saved in this prototype. Nothing has been sent." }))}>Save draft</Text>{drafts[thread.id] ? <Text style={styles.saved}>{drafts[thread.id]}</Text> : null}</View> : null}
            </View>
          </Surface>
        </Animated.View>)}
      </View>
      <View style={styles.bottomNote}><Ionicons name="information-circle-outline" size={16} color={colors.textMuted} /><Text style={styles.bottomText}>Sending replies is disabled until the relevant connector and permission checks are complete.</Text></View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  notice: { flexDirection: "row", gap: 9, alignItems: "flex-start", padding: 12 },
  noticeText: { color: colors.textSecondary, flex: 1, fontSize: 10, lineHeight: 16 },
  filters: { flexDirection: "row", gap: 8 },
  filter: { overflow: "hidden", paddingHorizontal: 13, paddingVertical: 8, color: colors.textSecondary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, fontSize: 11, fontWeight: "600" },
  filterActive: { color: colors.gold, backgroundColor: colors.goldSoft, borderColor: "rgba(215,185,130,0.45)" },
  thread: { flexDirection: "row", alignItems: "flex-start", gap: 11, padding: 13 },
  avatar: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  threadBody: { flex: 1, gap: 5 },
  threadTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { color: colors.text, fontSize: 12, fontWeight: "600" },
  time: { color: colors.textMuted, fontSize: 10 },
  context: { color: colors.textMuted, fontSize: 10 },
  text: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 3 },
  threadBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 5 },
  replyAction: { color: colors.gold, fontSize: 11, fontWeight: "700", paddingVertical: 5 },
  replyBox: { marginTop: 8, padding: 11, borderRadius: 12, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, gap: 8 },
  replyDraft: { color: colors.text, fontSize: 11, lineHeight: 17 },
  saved: { color: colors.success, fontSize: 10 },
  bottomNote: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  bottomText: { color: colors.textMuted, fontSize: 10, flex: 1, lineHeight: 15 },
});
