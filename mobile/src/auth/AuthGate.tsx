import { useEffect, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useSegments } from 'expo-router';
import { getSupabaseClient } from '@/lib/supabase';
import { colors } from '@/theme/tokens';

type GateState = 'loading' | 'authenticated' | 'signed_out' | 'configuration_error';

const hasUrl = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL?.trim());
const hasKey = Boolean(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim());
const hasPartialConfig = hasUrl !== hasKey;
const isSupabaseConfigured = hasUrl && hasKey;

export function AuthGate({ children }: PropsWithChildren) {
  const segments = useSegments();
  const [state, setState] = useState<GateState>(
    hasPartialConfig ? 'configuration_error' : isSupabaseConfigured ? 'loading' : 'authenticated',
  );

  useEffect(() => {
    if (!isSupabaseConfigured || hasPartialConfig) return;
    let active = true;
    let initialSessionResolved = false;

    try {
      const supabase = getSupabaseClient();
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        setState(session ? 'authenticated' : 'signed_out');
        initialSessionResolved = true;
      });

      void supabase.auth.getSession().then(({ data, error }) => {
        if (!active || initialSessionResolved) return;
        setState(error ? 'signed_out' : data.session ? 'authenticated' : 'signed_out');
      }).catch(() => {
        if (active) setState('signed_out');
      });

      return () => {
        active = false;
        listener.subscription.unsubscribe();
      };
    } catch {
      setState('configuration_error');
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || state === 'loading' || state === 'configuration_error') return;
    const onAuthRoute = segments[0] === 'auth';
    if (state === 'signed_out' && !onAuthRoute) router.replace('/auth');
    if (state === 'authenticated' && onAuthRoute) router.replace('/(tabs)');
  }, [segments, state]);

  if (!isSupabaseConfigured && !hasPartialConfig) return children;
  if (state === 'configuration_error') {
    return <View style={styles.center}><Text style={styles.title}>Setup needs attention</Text><Text style={styles.body}>Supabase configuration is incomplete or invalid. Configure both the project URL and publishable key for this environment.</Text></View>;
  }
  if (state === 'loading') {
    return <View style={styles.center}><ActivityIndicator color={colors.gold} size="large" /><Text style={styles.body}>Securing your workspace…</Text></View>;
  }
  if (state === 'signed_out' && segments[0] !== 'auth') return <Redirect href="/auth" />;
  if (state === 'authenticated' && segments[0] === 'auth') return <Redirect href="/(tabs)" />;
  return children;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14, backgroundColor: colors.canvas },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  body: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
