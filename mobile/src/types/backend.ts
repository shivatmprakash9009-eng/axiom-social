export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'analyst' | 'viewer';

export type DraftStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'archived';

export type WorkspaceSummary = {
  id: string;
  name: string;
  role: WorkspaceRole;
  createdAt: string;
};

export type ContentDraft = {
  id: string;
  workspaceId: string;
  createdBy: string;
  title: string;
  body: string;
  status: DraftStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'CONFLICT'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INTERNAL';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  requestId?: string;
};

export type ApiResult<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; error: ApiError; requestId: string };
