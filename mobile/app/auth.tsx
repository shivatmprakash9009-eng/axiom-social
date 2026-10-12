import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Surface } from '@/components/Surface';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { colors, radius } from '@/theme/tokens';

type Mode = 'sign_in' | 'sign_up';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setNotice('');
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (mode === 'sign_up' && password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'sign_in') {
        const result = await signInWithEmail(email, password);
        if (result.error) throw result.error;
        if (!result.session) throw new Error('No session was returned.');
        router.replace('/(tabs)');
      } else {
        const result = await signUpWithEmail(email, password, displayName);
        if (result.error) throw result.error;
        if (result.session) {
          router.replace('/(tabs)');
        } else {
          setNotice('Check your inbox to confirm your email, then return here to sign in.');
          setMode('sign_in');
        }
      }
    } catch {
      setError(mode === 'sign_in'
        ? 'We could not sign you in. Check your details and try again.'
        : 'We could not create your account. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <View style={styles.brandRow}><View style={styles.brandMark}><Text style={styles.brandMarkText}>A</Text></View><Text style={styles.brand}>AXIOM <Text style={styles.brandAccent}>SOCIAL</Text></Text></View>
        <View style={styles.hero}><Text style={styles.eyebrow}>YOUR SOCIAL COMMAND CENTER</Text><Text style={styles.title}>{mode === 'sign_in' ? 'Good to have you back.' : 'Build with intention.'}</Text><Text style={styles.subtitle}>One secure workspace for your content, channels and team.</Text></View>
        <Surface style={styles.card}>
          <View style={styles.switcher}>
            <Pressable accessibilityRole="button" onPress={() => { setMode('sign_in'); setError(''); setNotice(''); }} style={[styles.switchItem, mode === 'sign_in' && styles.switchItemActive]}><Text style={[styles.switchText, mode === 'sign_in' && styles.switchTextActive]}>Sign in</Text></Pressable>
            <Pressable accessibilityRole="button" onPress={() => { setMode('sign_up'); setError(''); setNotice(''); }} style={[styles.switchItem, mode === 'sign_up' && styles.switchItemActive]}><Text style={[styles.switchText, mode === 'sign_up' && styles.switchTextActive]}>Create account</Text></Pressable>
          </View>
          {mode === 'sign_up' && <><Text style={styles.label}>Name (optional)</Text><TextInput accessibilityLabel="Name" autoCapitalize="words" onChangeText={setDisplayName} placeholder="How should we address you?" placeholderTextColor={colors.textMuted} value={displayName} style={styles.input} /></>}
          <Text style={styles.label}>Email address</Text>
          <TextInput accessibilityLabel="Email address" autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="you@company.com" placeholderTextColor={colors.textMuted} value={email} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <TextInput accessibilityLabel="Password" autoCapitalize="none" autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'} onChangeText={setPassword} placeholder={mode === 'sign_up' ? 'At least 12 characters' : 'Your password'} placeholderTextColor={colors.textMuted} secureTextEntry value={password} style={styles.input} />
          {Boolean(error) && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          {Boolean(notice) && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}
          <Pressable accessibilityRole="button" disabled={busy} onPress={submit} style={({ pressed }) => [styles.submit, pressed && styles.submitPressed, busy && styles.submitDisabled]}>
            {busy ? <ActivityIndicator color={colors.canvas} /> : <Text style={styles.submitText}>{mode === 'sign_in' ? 'Enter workspace' : 'Create secure account'}</Text>}
          </Pressable>
          <Text style={styles.footnote}>Your workspace is protected by account authentication and database-level access policies.</Text>
        </Surface>
        <Text style={styles.footer}>PRIVATE BY DESIGN · BUILT FOR YOUR NEXT MOVE</Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, gap: 28, justifyContent: 'center', paddingVertical: 22 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold },
  brandMarkText: { color: colors.canvas, fontWeight: '900', fontSize: 19 },
  brand: { color: colors.text, fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  brandAccent: { color: colors.gold, fontWeight: '500' },
  hero: { gap: 10 },
  eyebrow: { color: colors.gold, fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  title: { color: colors.text, fontSize: 31, fontWeight: '700', letterSpacing: -0.9, lineHeight: 37 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, maxWidth: 310 },
  card: { padding: 18, gap: 12 },
  switcher: { flexDirection: 'row', backgroundColor: colors.surfaceRaised, borderRadius: radius.control, padding: 4, marginBottom: 8 },
  switchItem: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  switchItemActive: { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.borderStrong },
  switchText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  switchTextActive: { color: colors.text },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 3 },
  input: { borderRadius: 12, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceRaised, color: colors.text, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14 },
  error: { color: colors.danger, fontSize: 12, lineHeight: 18 },
  notice: { color: colors.success, fontSize: 12, lineHeight: 18 },
  submit: { minHeight: 48, borderRadius: 13, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginTop: 4 },
  submitPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  submitDisabled: { opacity: 0.65 },
  submitText: { color: colors.canvas, fontWeight: '800', fontSize: 14 },
  footnote: { color: colors.textMuted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 2 },
  footer: { color: colors.textMuted, fontSize: 9, letterSpacing: 1.5, textAlign: 'center' },
});
