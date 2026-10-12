import * as SecureStore from 'expo-secure-store';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';

const secureAuthStorage: SupportedStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

let client: ReturnType<typeof createClient> | null = null;

/**
 * Creates the Supabase client only when public project configuration is present.
 * The anon/publishable key is intended for clients; RLS is the security boundary.
 * Never put service-role keys, social access tokens, or AI provider keys in EXPO_PUBLIC_*.
 */
export function getSupabaseClient() {
  if (client) return client;

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error('Supabase is not configured for this environment.');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.');
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
    throw new Error('Supabase URL must use HTTPS outside local development.');
  }

  client = createClient(url, publishableKey, {
    auth: {
      storage: secureAuthStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
    global: {
      headers: { 'X-Client-Info': 'axiom-social-mobile' },
    },
  });

  return client;
}
