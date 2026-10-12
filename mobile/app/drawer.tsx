import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Screen } from "@/components/Screen";
import { Surface } from "@/components/Surface";
import { colors } from "@/theme/tokens";

const groups = [
  { title: "WORKSPACE", items: [
    { label: "Home", icon: "grid-outline" as const, route: "/(tabs)" as const },
    { label: "Content planner", icon: "calendar-outline" as const, route: "/(tabs)/planner" as const },
    { label: "Media library", icon: "images-outline" as const, route: "/media" as const },
    { label: "Templates", icon: "copy-outline" as const, route: "/templates" as const },
  ]},
  { title: "ENGAGE", items: [
    { label: "AI assistant", icon: "sparkles-outline" as const, route: "/(tabs)/assistant" as const },
    { label: "Inbox & comments", icon: "chatbubbles-outline" as const, route: "/(tabs)/inbox" as const },
    { label: "Analytics", icon: "stats-chart-outline" as const, route: "/(tabs)/insights" as const },
  ]},
  { title: "CONTROL ROOM", items: [
    { label: "Automations", icon: "git-network-outline" as const, route: "/automation" as const },
    { label: "Approvals", icon: "shield-checkmark-outline" as const, route: "/approvals" as const },
    { label: "Team & clients", icon: "people-outline" as const, route: "/team" as const },
  ]},
];
export default function DrawerScreen() {
 return <Screen><Animated.View entering={FadeInLeft.duration(260)} style={s.wrap}>
  <View style={s.top}><View style={s.brand}><View style={s.mark}><Ionicons name="aperture" size={23} color={colors.gold}/></View><View><Text style={s.brandTitle}>AXIOM</Text><Text style={s.brandSub}>SOCIAL WORKSPACE</Text></View></View><Pressable accessibilityRole="button" onPress={()=>router.back()} style={s.close}><Ionicons name="close" size={21} color={colors.text}/></Pressable></View>
  <Pressable accessibilityRole="button" onPress={()=>router.push("/workspace")} style={s.workspace}><View style={s.avatar}><Text style={s.avatarText}>S</Text></View><View style={{flex:1,gap:4}}><Text style={s.workspaceName}>Studio workspace</Text><Text style={s.workspaceSub}>Personal · Free preview</Text></View><Ionicons name="chevron-down" size={16} color={colors.textMuted}/></Pressable>
  {groups.map(group=><View key={group.title} style={s.group}><Text style={s.groupTitle}>{group.title}</Text>{group.items.map(item=><Pressable key={item.label} accessibilityRole="button" onPress={()=>router.push(item.route)} style={({pressed})=>[s.item,pressed&&s.itemPressed]}><Ionicons name={item.icon} size={19} color={colors.textSecondary}/><Text style={s.itemText}>{item.label}</Text><Ionicons name="chevron-forward" size={14} color={colors.textMuted}/></Pressable>)}</View>)}
  <Surface style={s.upgrade}><View style={s.upgradeIcon}><Ionicons name="sparkles" size={18} color={colors.gold}/></View><Text style={s.upgradeTitle}>Make more room to grow.</Text><Text style={s.upgradeSub}>Your creative command center, ready for the next chapter.</Text><Pressable accessibilityRole="button" onPress={()=>router.push("/settings")} style={s.upgradeAction}><Text style={s.upgradeActionText}>Explore workspace</Text><Ionicons name="arrow-forward" size={14} color={colors.canvas}/></Pressable></Surface>
  <View style={s.bottom}><Pressable accessibilityRole="button" onPress={()=>router.push("/profile")} style={s.profile}><View style={s.profileAvatar}><Ionicons name="person" size={17} color={colors.gold}/></View><View style={{flex:1,gap:3}}><Text style={s.profileName}>Your profile</Text><Text style={s.profileSub}>Account & preferences</Text></View><Ionicons name="settings-outline" size={18} color={colors.textMuted}/></Pressable><Text style={s.version}>AXIOM SOCIAL · FRONTEND PREVIEW</Text></View>
 </Animated.View></Screen>;
}
const s=StyleSheet.create({wrap:{gap:22},top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},brand:{flexDirection:"row",alignItems:"center",gap:11},mark:{width:45,height:45,borderRadius:15,backgroundColor:colors.goldSoft,borderWidth:1,borderColor:colors.borderStrong,alignItems:"center",justifyContent:"center"},brandTitle:{color:colors.text,fontSize:17,fontWeight:"800",letterSpacing:2},brandSub:{color:colors.textMuted,fontSize:9,letterSpacing:1.4,marginTop:3},close:{width:38,height:38,borderRadius:13,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},workspace:{flexDirection:"row",alignItems:"center",gap:12,padding:13,borderRadius:17,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border},avatar:{width:39,height:39,borderRadius:13,backgroundColor:colors.goldSoft,alignItems:"center",justifyContent:"center"},avatarText:{color:colors.gold,fontSize:16,fontWeight:"800"},workspaceName:{color:colors.text,fontSize:12,fontWeight:"700"},workspaceSub:{color:colors.textMuted,fontSize:10},group:{gap:6},groupTitle:{color:colors.textMuted,fontSize:9,fontWeight:"800",letterSpacing:1.7,marginBottom:4},item:{flexDirection:"row",alignItems:"center",gap:13,paddingHorizontal:12,paddingVertical:12,borderRadius:12},itemPressed:{backgroundColor:colors.surfaceRaised},itemText:{flex:1,color:colors.textSecondary,fontSize:12,fontWeight:"600"},upgrade:{gap:9,padding:15,backgroundColor:"#171713",borderColor:"rgba(215,185,130,0.2)"},upgradeIcon:{width:32,height:32,borderRadius:10,backgroundColor:colors.goldSoft,alignItems:"center",justifyContent:"center"},upgradeTitle:{color:colors.text,fontSize:14,fontWeight:"700"},upgradeSub:{color:colors.textSecondary,fontSize:11,lineHeight:17},upgradeAction:{marginTop:2,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8,padding:11,borderRadius:11,backgroundColor:colors.gold},upgradeActionText:{color:colors.canvas,fontSize:11,fontWeight:"800"},bottom:{gap:15,marginTop:3},profile:{flexDirection:"row",alignItems:"center",gap:10,paddingTop:15,borderTopWidth:1,borderTopColor:colors.border},profileAvatar:{width:38,height:38,borderRadius:13,backgroundColor:colors.surfaceRaised,alignItems:"center",justifyContent:"center"},profileName:{color:colors.text,fontSize:12,fontWeight:"700"},profileSub:{color:colors.textMuted,fontSize:10},version:{textAlign:"center",color:colors.textMuted,fontSize:8,letterSpacing:1.3}});
