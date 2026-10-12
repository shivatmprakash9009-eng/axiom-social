import type { AuthError, Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';

export type AuthResult = {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
};

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
  return { user: data.user, session: data.session, error };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || password.length < 12) {
    throw new Error('Enter a valid email and a password with at least 12 characters.');
  }
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: displayName?.trim() ? { name: displayName.trim().slice(0, 120) } : {},
    },
  });
  return { user: data.user, session: data.session, error };
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut({ scope: 'local' });
  if (error) throw error;
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}
