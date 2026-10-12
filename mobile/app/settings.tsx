import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { PlatformMark } from "@/components/PlatformMark";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors } from "@/theme/tokens";
import { signOut } from "@/lib/auth";

function Connection({ platform, subtitle }: { platform: "instagram" | "youtube"; subtitle: string }) {
  const name = platform === "instagram" ? "Instagram" : "YouTube";
  return (
    <Surface style={styles.connection}>
      <PlatformMark platform={platform} size={43} />
      <View style={styles.connectionCopy}><Text style={styles.connectionTitle}>{name}</Text><Text style={styles.connectionSub}>{subtitle}</Text><StatusPill label="Not connected" tone="neutral" /></View>
      <Pressable accessibilityRole="button" onPress={() => Alert.alert("Connection not configured", `The secure ${name} OAuth flow and backend token storage are not connected in this scaffold.`)} style={styles.connectButton}><Text style={styles.connectText}>Connect</Text><Ionicons name="open-outline" size={14} color={colors.gold} /></Pressable>
    </Surface>
  );
}

function Preference({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={styles.preference}><View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>{title}</Text><Text style={styles.preferenceSub}>{subtitle}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: "#303136", true: "rgba(215,185,130,0.55)" }} thumbColor={value ? colors.gold : "#A0A0A0"} /></View>;
}

export default function SettingsScreen() {
  const [draftAuto, setDraftAuto] = useState(true);
  const [approvalBeforePublish, setApprovalBeforePublish] = useState(true);
  const [replyAssist, setReplyAssist] = useState(false);
  const authConfigured = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() && process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim());
  const confirmSignOut = () => Alert.alert("Sign out of AXIOM?", "Your saved local drafts remain on this device. You will need to sign in again to access your account workspace.", [
    { text: "Cancel", style: "cancel" },
    { text: "Sign out", style: "destructive", onPress: () => { void signOut().catch(() => Alert.alert("Could not sign out", "Please try again.")); } },
  ]);
  return (
    <Screen>
      <View style={styles.topline}><Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={17} color={colors.text} /><Text style={styles.backText}>Back</Text></Pressable><StatusPill label="WORKSPACE" tone="gold" /></View>
      <ScreenHeader label="AXIOM SETTINGS" title="Your rules. Your control." subtitle="Decide what your assistant may prepare, and what needs your approval." />
      <View style={styles.section}>
        <SectionHeading title="Connected accounts" eyebrow="Integrations" />
        <Connection platform="instagram" subtitle="Professional account permissions" />
        <Connection platform="youtube" subtitle="Channel upload and analytics permissions" />
        <Text style={styles.note}>These connectors are not active yet. The Connect buttons explain the current setup boundary and do not start OAuth.</Text>
      </View>
      <View style={styles.section}>
        <SectionHeading title="Automation rules" eyebrow="Assistant behavior" />
        <Surface style={styles.preferences}>
          <Preference title="Auto-prepare drafts" subtitle="Let AI prepare drafts without publishing." value={draftAuto} onChange={setDraftAuto} />
          <View style={styles.divider} />
          <Preference title="Approval before publishing" subtitle="Require approval before any publish job." value={approvalBeforePublish} onChange={setApprovalBeforePublish} />
          <View style={styles.divider} />
          <Preference title="Suggest comment replies" subtitle="Prepare reply suggestions; never send automatically here." value={replyAssist} onChange={setReplyAssist} />
        </Surface>
        <Text style={styles.note}>These switches currently change local UI state only. Enforceable production policy must be saved and verified by the backend.</Text>
      </View>
      <View style={styles.section}>
        <SectionHeading title="Workspace safeguards" eyebrow="Security" />
        <Surface style={styles.safeguard}><Ionicons name="lock-closed-outline" size={19} color={colors.gold} /><View style={styles.safeguardCopy}><Text style={styles.safeguardTitle}>Credentials stay server-side</Text><Text style={styles.safeguardSub}>Social access tokens and provider secrets will never be stored in the mobile bundle.</Text></View></Surface>
        <Surface style={styles.safeguard}><Ionicons name="receipt-outline" size={19} color={colors.gold} /><View style={styles.safeguardCopy}><Text style={styles.safeguardTitle}>Action history</Text><Text style={styles.safeguardSub}>Production runs will record approval, execution status, result and safe error details.</Text></View></Surface>
      </View>
      {authConfigured ? <View style={styles.section}>
        <SectionHeading title="Account" eyebrow="Session controls" />
        <Pressable accessibilityRole="button" onPress={confirmSignOut} style={styles.signOutButton}><Ionicons name="log-out-outline" size={17} color={colors.danger} /><Text style={styles.signOutText}>Sign out securely</Text></Pressable>
      </View> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  topline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  back: { flexDirection: "row", gap: 3, alignItems: "center", paddingVertical: 5 },
  backText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  section: { gap: 11 },
  connection: { flexDirection: "row", alignItems: "center", gap: 11, padding: 12 },
  connectionCopy: { flex: 1, gap: 4 },
  connectionTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  connectionSub: { color: colors.textMuted, fontSize: 10, marginBottom: 3 },
  connectButton: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.goldSoft },
  connectText: { color: colors.gold, fontSize: 10, fontWeight: "700" },
  note: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  preferences: { paddingHorizontal: 14, paddingVertical: 2 },
  preference: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14 },
  preferenceCopy: { flex: 1, gap: 4 },
  preferenceTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  preferenceSub: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  divider: { height: 1, backgroundColor: colors.border },
  safeguard: { flexDirection: "row", alignItems: "flex-start", gap: 11, padding: 14 },
  safeguardCopy: { flex: 1, gap: 4 },
  safeguardTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  safeguardSub: { color: colors.textMuted, fontSize: 10, lineHeight: 16 },
  signOutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 13, borderWidth: 1, borderColor: "rgba(229,139,139,0.25)", backgroundColor: "rgba(229,139,139,0.06)" },
  signOutText: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  signOutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 13, borderWidth: 1, borderColor: "rgba(229,139,139,0.25)", backgroundColor: "rgba(229,139,139,0.06)" },
  signOutText: { color: colors.danger, fontSize: 12, fontWeight: "700" },
});
