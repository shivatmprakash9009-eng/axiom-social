import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActionButton } from "@/components/ActionButton";
import { PlatformMark } from "@/components/PlatformMark";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors, radius } from "@/theme/tokens";
import { loadLatestLocalDraft, saveLocalDraft, type LocalDraft } from "@/lib/localDrafts";

type Target = "instagram" | "youtube";
export default function ComposeScreen() {
  const [target, setTarget] = useState<Target>("instagram");
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [latestDraft, setLatestDraft] = useState<LocalDraft | null>(null);

  useEffect(() => {
    let active = true;
    void loadLatestLocalDraft().then((draft) => { if (active) setLatestDraft(draft); }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const restoreLatestDraft = () => {
    if (!latestDraft) return;
    setTarget(latestDraft.target);
    setTitle(latestDraft.title);
    setCaption(latestDraft.caption);
    setAsset(null);
    setSaved(true);
    Alert.alert("Draft restored", "Text and destination are restored. Re-select the media file if the draft used one.");
  };

  const chooseMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images", "videos"], allowsEditing: false, quality: 0.9, videoMaxDuration: 180 });
    if (!result.canceled) { setAsset(result.assets[0] ?? null); setSaved(false); }
  };
  const saveDraft = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const draft = await saveLocalDraft({
        target,
        title: title.trim(),
        caption: caption.trim(),
        mediaName: asset?.fileName ?? null,
        mediaType: asset?.type === "image" || asset?.type === "video" ? asset.type : null,
      });
      setLatestDraft(draft);
      setSaved(true);
      Alert.alert("Draft saved on this device", "Your text and destination are saved between sessions. Media itself is not copied, uploaded, or published; you may need to select it again later.");
    } catch {
      Alert.alert("Draft could not be saved", "Check available device storage and, if this is an account workspace, confirm you are signed in.");
    } finally {
      setSaving(false);
    }
  };
  const showPublishBoundary = () => Alert.alert("Publishing not connected", "This build does not have Instagram or YouTube OAuth and server-side publishing enabled yet.");

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(260)} style={{ gap: 23 }}>
        <View style={styles.nav}><Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={15} color={colors.text} /><Text style={styles.backText}>Close</Text></Pressable><StatusPill label="DRAFT STUDIO" tone="gold" /></View>
        <ScreenHeader title="Make it matter." subtitle="One idea, shaped for the place it belongs." />
        <View style={styles.targets}>
          <Text style={styles.label}>PUBLISHING DESTINATION</Text>
          <View style={styles.targetRow}>
            {(["instagram", "youtube"] as const).map(value => (
              <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: target === value }} onPress={() => setTarget(value)} style={[styles.target, target === value && styles.targetActive]}>
                <PlatformMark platform={value} size={34} />
                <Text style={styles.targetTitle}>{value === "instagram" ? "Instagram" : "YouTube"}</Text>
                <Text style={styles.targetHint}>{value === "instagram" ? "Reels & posts" : "Videos & Shorts"}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTop}><Text style={styles.label}>01 · YOUR MEDIA</Text><Text style={styles.optional}>Optional</Text></View>
          <Surface style={styles.mediaSurface}>
            {asset?.uri ? (
              <View style={styles.previewWrap}>
                {asset.type === "image" ? <Image source={{ uri: asset.uri }} style={styles.preview} resizeMode="cover" /> : <View style={styles.videoPreview}><Ionicons name="videocam" size={35} color={colors.gold} /><Text style={styles.videoText}>{asset.fileName ?? "Selected video"}</Text><Text style={styles.videoMeta}>{asset.duration ? Math.round(asset.duration / 1000) + " seconds" : "Video selected"}</Text></View>}
                <Pressable accessibilityRole="button" onPress={chooseMedia}><Text style={styles.changeMedia}>Change media</Text></Pressable>
              </View>
            ) : (
              <View style={styles.mediaEmpty}>
                <View style={styles.uploadIcon}><Ionicons name="cloud-upload-outline" size={25} color={colors.gold} /></View>
                <Text style={styles.mediaTitle}>Bring your story in.</Text>
                <Text style={styles.mediaSub}>Choose an image or video from your device.</Text>
                <ActionButton label="Choose media" variant="secondary" onPress={chooseMedia}><Ionicons name="add" size={17} color={colors.text} /></ActionButton>
              </View>
            )}
          </Surface>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>02 · YOUR MESSAGE</Text>
          {target === "youtube" ? <Surface style={styles.fieldCard}><Text style={styles.fieldLabel}>VIDEO TITLE</Text><TextInput value={title} onChangeText={v => { setTitle(v); setSaved(false); }} placeholder="Give your video a clear, compelling title…" placeholderTextColor={colors.textMuted} maxLength={100} style={styles.titleInput} /><Text style={styles.counter}>{title.length}/100</Text></Surface> : null}
          <Surface style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>{target === "instagram" ? "CAPTION" : "DESCRIPTION"}</Text>
            <TextInput value={caption} onChangeText={v => { setCaption(v); setSaved(false); }} placeholder="Tell the story behind your content…" placeholderTextColor={colors.textMuted} multiline textAlignVertical="top" maxLength={2200} style={styles.captionInput} />
            <View style={styles.fieldFooter}><Text style={styles.helper}>Keep it clear. Keep it yours.</Text><Text style={styles.counter}>{caption.length}/2200</Text></View>
          </Surface>
          <View style={styles.aiHint}><Ionicons name="sparkles" size={13} color={colors.gold} /><Text style={styles.aiHintText}>AI caption suggestions will be added after the backend provider is configured.</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>03 · READY WHEN YOU ARE</Text>
          <Surface style={styles.validation}>
            <View style={styles.validationRow}><Ionicons name={asset ? "checkmark-circle" : "ellipse-outline"} size={17} color={asset ? colors.success : colors.textMuted} /><Text style={styles.validationText}>Media attached</Text><Text style={styles.validationState}>{asset ? "Selected" : "Not added"}</Text></View>
            <View style={styles.validationRow}><Ionicons name={(target === "youtube" ? title.trim().length > 0 : caption.trim().length > 0) ? "checkmark-circle" : "ellipse-outline"} size={17} color={(target === "youtube" ? title.trim().length > 0 : caption.trim().length > 0) ? colors.success : colors.textMuted} /><Text style={styles.validationText}>{target === "youtube" ? "Video title" : "Caption"}</Text><Text style={styles.validationState}>{(target === "youtube" ? title.trim().length > 0 : caption.trim().length > 0) ? "Added" : "Recommended"}</Text></View>
            <View style={styles.validationRow}><Ionicons name="lock-closed-outline" size={17} color={colors.warning} /><Text style={styles.validationText}>Account authorization</Text><Text style={styles.validationState}>Not connected</Text></View>
          </Surface>
        </View>

        {saved ? <View style={styles.saved}><Ionicons name="checkmark-circle" size={15} color={colors.success} /><Text style={styles.savedText}>Saved on this device.</Text></View> : null}\n        {latestDraft ? <Pressable accessibilityRole="button" onPress={restoreLatestDraft} style={styles.restoreDraft}><Ionicons name="refresh-outline" size={14} color={colors.gold} /><Text style={styles.restoreDraftText}>Restore latest saved draft</Text><Text style={styles.restoreDraftDate}>{new Date(latestDraft.updatedAt).toLocaleDateString()}</Text></Pressable> : null}
        <View style={styles.actions}><View style={{ flex: 1 }}><ActionButton label={saving ? "Saving…" : "Save draft"} variant="secondary" onPress={saveDraft}><Ionicons name="bookmark-outline" size={16} color={colors.text} /></ActionButton></View><View style={{ flex: 1 }}><ActionButton label="Continue" onPress={showPublishBoundary}><Ionicons name="arrow-forward" size={16} color={colors.canvas} /></ActionButton></View></View>
        <Text style={styles.footer}>No content is uploaded to a social platform from this prototype. Publishing unlocks only after account permissions and a secure backend are configured.</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 35 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { flexDirection: "row", alignItems: "center", gap: 2, paddingVertical: 5 },
  backText: { color: colors.text, fontSize: 12, fontWeight: "600" },
  targets: { gap: 12 },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 1.25 },
  targetRow: { flexDirection: "row", gap: 10 },
  target: { flex: 1, alignItems: "center", gap: 7, paddingVertical: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  targetActive: { borderColor: "rgba(215,185,130,0.55)", backgroundColor: colors.goldSoft },
  targetTitle: { color: colors.text, fontSize: 12, fontWeight: "700" },
  targetHint: { color: colors.textMuted, fontSize: 10 },
  optional: { color: colors.textMuted, fontSize: 10 },
  section: { gap: 11 },
  sectionTop: { flexDirection: "row", justifyContent: "space-between" },
  mediaSurface: { padding: 0, overflow: "hidden" },
  mediaEmpty: { minHeight: 190, alignItems: "center", justifyContent: "center", padding: 20, gap: 10 },
  uploadIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  mediaTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  mediaSub: { color: colors.textMuted, fontSize: 11, textAlign: "center", marginBottom: 3 },
  previewWrap: { gap: 10, alignItems: "center", paddingBottom: 13 },
  preview: { width: "100%", height: 230, backgroundColor: colors.surfaceRaised },
  videoPreview: { height: 190, width: "100%", gap: 7, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceRaised },
  videoText: { color: colors.text, fontSize: 12, fontWeight: "600", maxWidth: 270 },
  videoMeta: { color: colors.textMuted, fontSize: 10 },
  changeMedia: { color: colors.gold, fontSize: 11, fontWeight: "700", padding: 4 },
  fieldCard: { padding: 14, gap: 8 },
  fieldLabel: { color: colors.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  titleInput: { minHeight: 42, color: colors.text, fontSize: 13, paddingVertical: 7 },
  captionInput: { minHeight: 120, color: colors.text, fontSize: 13, lineHeight: 20, paddingVertical: 7 },
  fieldFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  helper: { color: colors.textMuted, fontSize: 10 },
  counter: { color: colors.textMuted, fontSize: 9 },
  aiHint: { flexDirection: "row", alignItems: "flex-start", gap: 7 },
  aiHintText: { color: colors.textMuted, fontSize: 10, lineHeight: 15, flex: 1 },
  validation: { gap: 14 },
  validationRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  validationText: { flex: 1, color: colors.textSecondary, fontSize: 11 },
  validationState: { color: colors.textMuted, fontSize: 10 },
  saved: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 },
  savedText: { color: colors.success, fontSize: 11 },\n  restoreDraft: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.control, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },\n  restoreDraftText: { flex: 1, color: colors.textSecondary, fontSize: 11, fontWeight: "600" },\n  restoreDraftDate: { color: colors.textMuted, fontSize: 10 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  footer: { color: colors.textMuted, textAlign: "center", fontSize: 10, lineHeight: 16, marginTop: 3 },
});
