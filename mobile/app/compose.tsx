import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActionButton } from "@/components/ActionButton";
import { PlatformMark } from "@/components/PlatformMark";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StatusPill } from "@/components/StatusPill";
import { Surface } from "@/components/Surface";
import { colors, radius } from "@/theme/tokens";

type Target = "instagram" | "youtube";
export default function ComposeScreen() {
  const [target, setTarget] = useState<Target>("instagram");
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [saved, setSaved] = useState(false);
  const chooseMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 0.9,
      videoMaxDuration: 180,
    });
    if (!result.canceled) {
      setAsset(result.assets[0] ?? null);
      setSaved(false);
    }
  };
  const saveDraft = () => {
    setSaved(true);
    Alert.alert("Draft preview saved", "This prototype keeps draft state in the current session only. Persistent storage will be added with the backend.");
  };
  const showPublishBoundary = () => {
    Alert.alert("Publishing not connected", "This build does not have Instagram or YouTube OAuth and server-side publishing enabled yet.");
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(260)} style={{ gap: 23 }}>
        <View style={styles.nav}><Text onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={15} color={colors.text} /> Close</Text><StatusPill label="DRAFT STUDIO" tone="gold" /></View>
        <ScreenHeader title="Make it matter." subtitle="One idea, shaped for the place it belongs." />
        <View style={styles.targets}>
          <Text style={styles.label}>PUBLISHING DESTINATION</Text>
          <View style={styles.targetRow}>
            {(["instagram", "youtube"] as const).map(value => (
              <View key={value} style={{ flex: 1 }}>
                <Text onPress={() => setTarget(value)} style={[styles.target, target === value && styles.targetActive]}>
                  <PlatformMark platform={value} size={34} />
                  {"\n"}{value === "instagram" ? "Instagram" : "YouTube"}
                  {"\n"}<Text style={styles.targetHint}>{value === "instagram" ? "Reels & posts" : "Videos & Shorts"}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTop}><Text style={styles.label}>01 · YOUR MEDIA</Text><Text style={styles.optional}>Optional</Text></View>
          <Surface style={styles.mediaSurface}>
            {asset?.uri ? (
              <View style={styles.previewWrap}>
                {asset.type === "image" ? <Image source={{ uri: asset.uri }} style={styles.preview} resizeMode="cover" /> : <View style={styles.videoPreview}><Ionicons name="videocam" size={35} color={colors.gold} /><Text style={styles.videoText}>{asset.fileName ?? "Selected video"}</Text><Text style={styles.videoMeta}>{asset.duration ? Math.round(asset.duration / 1000) + " seconds" : "Video selected"}</Text></View>}
                <Text style={styles.changeMedia} onPress={chooseMedia}>Change media</Text>
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
          {target === "youtube" ? (
            <Surface style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>VIDEO TITLE</Text>
              <TextInput value={title} onChangeText={v => { setTitle(v); setSaved(false); }} placeholder="Give your video a clear, compelling title…" placeholderTextColor={colors.textMuted} maxLength={100} style={styles.titleInput} />
              <Text style={styles.counter}>{title.length}/100</Text>
            </Surface>
          ) : null}
          <Surface style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>{target === "instagram" ? "CAPTION" : "DESCRIPTION"}</Text>
            <TextInput value={caption} onChangeText={v => { setCaption(v); setSaved(false); }} placeholder="Tell the story behind your content…" placeholderTextColor={colors.textMuted} multiline textAlignVertical="top" maxLength={2200} style={styles.captionInput} />
            <View style={styles.fieldFooter}><Text style={styles.helper}>Keep it clear. Keep it yours.</Text><Text style={styles.counter}>{caption.length}/2200</Text></View>
          </Surface>
          <Text style={styles.aiHint}><Ionicons name="sparkles" size={13} color={colors.gold} /> AI caption suggestions will be added after the backend provider is configured.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>03 · READY WHEN YOU ARE</Text>
          <Surface style={styles.validation}>
            <View style={styles.validationRow}><Ionicons name={asset ? "checkmark-circle" : "ellipse-outline"} size={17} color={asset ? colors.success : colors.textMuted} /><Text style={styles.validationText}>Media attached</Text><Text style={styles.validationState}>{asset ? "Ready to validate" : "Not added"}</Text></View>
            <View style={styles.validationRow}><Ionicons name={(target === "youtube" ? title.trim().length > 0 : true) ? "checkmark-circle" : "ellipse-outline"} size={17} color={target === "youtube" && !title.trim() ? colors.textMuted : colors.success} /><Text style={styles.validationText}>{target === "youtube" ? "Video title" : "Caption"}</Text><Text style={styles.validationState}>{target === "youtube" ? (title.trim() ? "Added" : "Recommended") : (caption.trim() ? "Added" : "Optional")}</Text></View>
            <View style={styles.validationRow}><Ionicons name="lock-closed-outline" size={17} color={colors.warning} /><Text style={styles.validationText}>Account authorization</Text><Text style={styles.validationState}>Not connected</Text></View>
          </Surface>
        </View>

        {saved ? <Text style={styles.saved}><Ionicons name="checkmark-circle" size={15} color={colors.success} /> Current draft is marked saved in this session.</Text> : null}
        <View style={styles.actions}><ActionButton label="Save draft" variant="secondary" onPress={saveDraft}><Ionicons name="bookmark-outline" size={16} color={colors.text} /></ActionButton><View style={{ flex: 1 }}><ActionButton label="Continue" onPress={showPublishBoundary}><Ionicons name="arrow-forward" size={16} color={colors.canvas} /></ActionButton></View></View>
        <Text style={styles.footer}>No content is uploaded to a social platform from this prototype. Publishing unlocks only after account permissions and a secure backend are configured.</Text>
      </Animated.View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 35 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { color: colors.text, fontSize: 12, fontWeight: "600", flexDirection: "row", alignItems: "center" },
  targets: { gap: 12 },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 1.25 },
  targetRow: { flexDirection: "row", gap: 10 },
  target: { overflow: "hidden", textAlign: "center", paddingVertical: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, color: colors.text, fontSize: 12, fontWeight: "700", lineHeight: 22 },
  targetActive: { borderColor: "rgba(215,185,130,0.55)", backgroundColor: colors.goldSoft },
  targetHint: { color: colors.textMuted, fontSize: 10, fontWeight: "400" },
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
  aiHint: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  validation: { gap: 14 },
  validationRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  validationText: { flex: 1, color: colors.textSecondary, fontSize: 11 },
  validationState: { color: colors.textMuted, fontSize: 10 },
  saved: { flexDirection: "row", color: colors.success, fontSize: 11, marginBottom: 10 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  footer: { color: colors.textMuted, textAlign: "center", fontSize: 10, lineHeight: 16, marginTop: 3 },
});
