import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { ActionButton } from "@/components/ActionButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Surface } from "@/components/Surface";
import { colors, radius } from "@/theme/tokens";

const suggestions = [
  { icon: "calendar-outline" as const, title: "Plan my week", body: "Build a balanced content calendar" },
  { icon: "videocam-outline" as const, title: "Create a short", body: "Turn an idea into a video brief" },
  { icon: "chatbubble-ellipses-outline" as const, title: "Reply with care", body: "Draft thoughtful audience replies" },
];
type Message = { id: number; role: "user"; text: string };

export default function AssistantScreen() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [notice, setNotice] = useState("");
  const send = (value = prompt) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages(previous => [...previous, { id: Date.now(), role: "user", text: clean }]);
    setPrompt("");
    setNotice("Prototype mode: your request is shown locally. AI planning and tool execution activate after the secure backend is connected.");
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
      <View style={styles.screen}>
        <ScreenHeader title="What’s on your mind?" subtitle="Tell your assistant what you want to achieve. You choose what runs." />
        <View style={styles.capability}><Ionicons name="shield-checkmark-outline" size={16} color={colors.gold} /><Text style={styles.capabilityText}>The assistant plans first. Actions follow permissions and approval rules.</Text></View>
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Animated.View entering={FadeInDown.duration(360)} style={styles.orbOuter}><View style={styles.orbInner}><Ionicons name="sparkles" size={28} color={colors.gold} /></View></Animated.View>
            <Text style={styles.emptyTitle}>Your social strategist.</Text>
            <Text style={styles.emptyBody}>Start with a goal, a piece of content, or a question about your channels.</Text>
            <View style={styles.suggestions}>
              {suggestions.map((item, index) => (
                <Animated.View key={item.title} entering={FadeInDown.delay(100 + index * 70).duration(280)}>
                  <Pressable accessibilityRole="button" accessibilityLabel={"Use suggestion " + item.title} onPress={() => send(item.title + ": " + item.body)}>
                    <Surface style={styles.suggestion}>
                      <View style={styles.suggestionIcon}><Ionicons name={item.icon} size={18} color={colors.gold} /></View>
                      <View style={styles.suggestionCopy}><Text style={styles.suggestionTitle}>{item.title}</Text><Text style={styles.suggestionBody}>{item.body}</Text></View>
                      <Ionicons name="arrow-up" size={16} color={colors.textMuted} />
                    </Surface>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.messages}>
            {messages.map(message => <View key={message.id} style={styles.userBubble}><Text style={styles.bubbleText}>{message.text}</Text></View>)}
            <Surface style={styles.previewResponse}><Ionicons name="information-circle-outline" size={17} color={colors.gold} /><Text style={styles.previewText}>{notice}</Text></Surface>
            <ActionButton label="Create a content draft" variant="secondary" onPress={() => router.push("/compose")}><Ionicons name="create-outline" size={17} color={colors.text} /></ActionButton>
          </View>
        )}
        <View style={styles.composer}>
          <View style={styles.composerTop}>
            <TextInput value={prompt} onChangeText={setPrompt} placeholder="Ask AXIOM to plan, create or review…" placeholderTextColor={colors.textMuted} multiline maxLength={2000} style={styles.input} accessibilityLabel="Message the AXIOM assistant" returnKeyType="default" />
            <View style={styles.sendWrap}><ActionButton label="" onPress={() => send()} disabled={!prompt.trim()}><Ionicons name="arrow-up" size={18} color={colors.canvas} /></ActionButton></View>
          </View>
          <View style={styles.composerFooter}><Ionicons name="lock-closed-outline" size={12} color={colors.textMuted} /><Text style={styles.footerText}>Secure execution is not configured yet</Text><View style={{ flex: 1 }} /><Text style={styles.counter}>{prompt.length}/2000</Text></View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  screen: { flex: 1, paddingTop: 18, paddingHorizontal: 20, paddingBottom: 14, gap: 18 },
  capability: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: "rgba(215,185,130,0.12)" },
  capabilityText: { color: colors.textSecondary, fontSize: 10, flex: 1, lineHeight: 15 },
  empty: { flex: 1, justifyContent: "center", gap: 13 },
  orbOuter: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(215,185,130,0.18)", backgroundColor: "rgba(215,185,130,0.045)", marginBottom: 4 },
  orbInner: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldSoft },
  emptyTitle: { color: colors.text, fontSize: 23, fontWeight: "600", letterSpacing: -0.6 },
  emptyBody: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, maxWidth: 310, marginBottom: 5 },
  suggestions: { gap: 9, marginTop: 5 },
  suggestion: { flexDirection: "row", alignItems: "center", gap: 11, padding: 12 },
  suggestionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldSoft },
  suggestionCopy: { flex: 1, gap: 3 },
  suggestionTitle: { color: colors.text, fontSize: 12, fontWeight: "600" },
  suggestionBody: { color: colors.textMuted, fontSize: 10 },
  messages: { flex: 1, gap: 12, paddingTop: 6 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#2C281E", borderBottomRightRadius: 5, padding: 13, borderRadius: radius.card, maxWidth: "88%" },
  bubbleText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  previewResponse: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  previewText: { color: colors.textSecondary, fontSize: 11, flex: 1, lineHeight: 17 },
  composer: { borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, padding: 12, gap: 10 },
  composerTop: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: 13, minHeight: 42, maxHeight: 120, paddingTop: 10, paddingBottom: 8, textAlignVertical: "top" },
  sendWrap: { width: 44 },
  composerFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerText: { color: colors.textMuted, fontSize: 9 },
  counter: { color: colors.textMuted, fontSize: 9 },
});
