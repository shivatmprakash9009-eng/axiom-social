import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/tokens";
type Platform = "instagram" | "youtube";
export function PlatformMark({ platform, size = 42 }: { platform: Platform; size?: number }) {
  const instagram = platform === "instagram";
  return <View style={[styles.base, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: instagram ? "rgba(214,162,185,0.12)" : "rgba(240,138,135,0.12)" }]}><Ionicons name={instagram ? "logo-instagram" : "logo-youtube"} size={size * 0.48} color={instagram ? colors.instagram : colors.youtube} /></View>;
}
const styles = StyleSheet.create({ base: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border } });
