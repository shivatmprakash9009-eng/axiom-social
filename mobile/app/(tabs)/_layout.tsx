import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";

const tabs = [
  { name: "index", title: "Home", icon: "grid-outline", active: "grid" },
  { name: "planner", title: "Planner", icon: "calendar-outline", active: "calendar" },
  { name: "assistant", title: "Assistant", icon: "sparkles-outline", active: "sparkles" },
  { name: "inbox", title: "Inbox", icon: "chatbubble-ellipses-outline", active: "chatbubble-ellipses" },
  { name: "insights", title: "Insights", icon: "stats-chart-outline", active: "stats-chart" },
] as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { height: 82, paddingTop: 10, paddingBottom: 23, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 0 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", letterSpacing: 0.2, marginTop: 3 },
        tabBarItemStyle: { borderRadius: 14 },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{
          title: tab.title,
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={(focused ? tab.active : tab.icon) as never} size={size} color={color} />,
        }} />
      ))}
    </Tabs>
  );
}
