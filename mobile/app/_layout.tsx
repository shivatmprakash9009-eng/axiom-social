import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/theme/tokens";
import { AuthGate } from "@/auth/AuthGate";

export default function RootLayout() {
  return <GestureHandlerRootView style={{flex:1,backgroundColor:colors.canvas}}>
    <SafeAreaProvider><StatusBar style="light"/><AuthGate><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.canvas},animation:"fade_from_bottom",animationDuration:220}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="auth" options={{gestureEnabled:false}}/>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="compose" options={{presentation:"modal",animation:"slide_from_bottom",gestureEnabled:true}}/>
      <Stack.Screen name="editor" options={{presentation:"modal",animation:"slide_from_bottom"}}/>
      <Stack.Screen name="settings" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="drawer" options={{animation:"slide_from_left"}}/>
      <Stack.Screen name="media" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="templates" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="automation" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="approvals" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="team" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="workspace" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="profile" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="notifications" options={{animation:"slide_from_right"}}/>
      <Stack.Screen name="search" options={{animation:"fade_from_bottom"}}/>
    </Stack></AuthGate></SafeAreaProvider>
  </GestureHandlerRootView>;
}
