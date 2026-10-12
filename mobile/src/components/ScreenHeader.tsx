import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/theme/tokens";

type Props = { label?: string; title: string; subtitle?: string; onPressSettings?: () => void };
export function ScreenHeader({ label = "AXIOM SOCIAL", title, subtitle, onPressSettings }: Props) {
  return <View style={styles.wrap}>
    <View style={styles.top}>
      <View style={styles.brand}><View style={styles.symbol}><Ionicons name="aperture" size={19} color={colors.gold}/></View><Text style={styles.brandName}>{label}</Text></View>
      <View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel="Search AXIOM" onPress={()=>router.push("/search")} style={styles.settings}><Ionicons name="search-outline" size={18} color={colors.textSecondary}/></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={()=>router.push("/notifications")} style={styles.settings}><Ionicons name="notifications-outline" size={18} color={colors.textSecondary}/></Pressable>
        {onPressSettings ? <Pressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={onPressSettings} style={styles.settings}><Ionicons name="options-outline" size={19} color={colors.textSecondary}/></Pressable> : <Pressable accessibilityRole="button" accessibilityLabel="Open navigation drawer" onPress={()=>router.push("/drawer")} style={styles.settings}><Ionicons name="menu" size={21} color={colors.textSecondary}/></Pressable>}
      </View>
    </View>
    <View style={styles.copy}><Text style={styles.title}>{title}</Text>{subtitle?<Text style={styles.subtitle}>{subtitle}</Text>:null}</View>
  </View>;
}
const styles=StyleSheet.create({wrap:{gap:27},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},brand:{flexDirection:"row",alignItems:"center",gap:9},symbol:{height:32,width:32,borderRadius:11,backgroundColor:colors.goldSoft,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"rgba(215,185,130,0.2)"},brandName:{color:colors.text,fontSize:12,letterSpacing:1.35,fontWeight:"800"},actions:{flexDirection:"row",alignItems:"center",gap:8},settings:{width:40,height:40,borderRadius:13,backgroundColor:colors.surface,borderColor:colors.border,borderWidth:1,alignItems:"center",justifyContent:"center"},copy:{gap:6},title:{fontSize:32,fontWeight:"600",color:colors.text,letterSpacing:-1.2,lineHeight:37},subtitle:{color:colors.textSecondary,fontSize:13,lineHeight:20}});
