import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentSession } from './auth';

export type LocalDraftTarget = 'instagram' | 'youtube';

export type LocalDraft = {
  id: string;
  target: LocalDraftTarget;
  title: string;
  caption: string;
  mediaName: string | null;
  mediaType: 'image' | 'video' | null;
  updatedAt: string;
};

type DraftStore = { version: 1; drafts: LocalDraft[] };
const STORE_PREFIX = '@axiom-social/drafts/v1/';
const MAX_DRAFTS = 100;
const MAX_TEXT_LENGTH = 10000;

async function storeKey(): Promise<string> {
  const hasUrl = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL?.trim());
  const hasKey = Boolean(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim());
  if (hasUrl !== hasKey) throw new Error('Account configuration is incomplete; local draft access is paused.');
  if (!hasUrl) return STORE_PREFIX + 'local-preview';

  const session = await getCurrentSession();
  if (!session?.user.id) throw new Error('Sign in to access account-scoped drafts.');
  return STORE_PREFIX + session.user.id;
}

async function readStore(key: string): Promise<DraftStore> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return { version: 1, drafts: [] };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' && parsed !== null &&
      'version' in parsed && parsed.version === 1 &&
      'drafts' in parsed && Array.isArray(parsed.drafts)
    ) {
      return { version: 1, drafts: parsed.drafts.filter(isLocalDraft).slice(0, MAX_DRAFTS) };
    }
  } catch {
    // A corrupt local cache should not crash the composer; the next save replaces it.
  }
  return { version: 1, drafts: [] };
}

function isLocalDraft(value: unknown): value is LocalDraft {
  if (typeof value !== 'object' || value === null) return false;
  const draft = value as Partial<LocalDraft>;
  return typeof draft.id === 'string' &&
    (draft.target === 'instagram' || draft.target === 'youtube') &&
    typeof draft.title === 'string' && typeof draft.caption === 'string' &&
    (draft.mediaName === null || typeof draft.mediaName === 'string') &&
    (draft.mediaType === null || draft.mediaType === 'image' || draft.mediaType === 'video') &&
    typeof draft.updatedAt === 'string';
}

export async function saveLocalDraft(input: Omit<LocalDraft, 'id' | 'updatedAt'> & { id?: string }): Promise<LocalDraft> {
  if (input.title.length > 100 || input.caption.length > MAX_TEXT_LENGTH) {
    throw new Error('Draft text is longer than the supported limit.');
  }
  const key = await storeKey();
  const store = await readStore(key);
  const draft: LocalDraft = {
    ...input,
    id: input.id ?? createDraftId(),
    updatedAt: new Date().toISOString(),
  };
  const drafts = [draft, ...store.drafts.filter((item) => item.id !== draft.id)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_DRAFTS);
  await AsyncStorage.setItem(key, JSON.stringify({ version: 1, drafts } satisfies DraftStore));
  return draft;
}

export async function loadLatestLocalDraft(): Promise<LocalDraft | null> {
  const key = await storeKey();
  const store = await readStore(key);
  return [...store.drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;
}

export async function listLocalDrafts(): Promise<LocalDraft[]> {
  const key = await storeKey();
  const store = await readStore(key);
  return [...store.drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function createDraftId(): string {
  // Crypto UUID support differs by React Native runtime; random values are IDs, not secrets.
  return 'draft_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}
