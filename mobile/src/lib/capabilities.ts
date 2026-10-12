/**
 * Feature flags are deliberately fail-closed. A provider is not "live" merely
 * because credentials exist; only the authorized-account verification process
 * may move a capability to verified.
 */
export type CapabilityState = 'unavailable' | 'configured_unverified' | 'verified';

export type ProviderCapabilities = {
  accountConnection: CapabilityState;
  mediaPublishing: CapabilityState;
  commentManagement: CapabilityState;
  analyticsRead: CapabilityState;
};

export type PlatformCapabilityRecord = {
  platform: 'instagram' | 'youtube';
  state: CapabilityState;
  capabilities: ProviderCapabilities;
  verificationEvidence?: {
    verifiedAt: string;
    testAccountReference: string;
    testRunUrl: string;
  };
};

const unavailableCapabilities = (): ProviderCapabilities => ({
  accountConnection: 'unavailable',
  mediaPublishing: 'unavailable',
  commentManagement: 'unavailable',
  analyticsRead: 'unavailable',
});

export const initialPlatformCapabilities: PlatformCapabilityRecord[] = [
  { platform: 'instagram', state: 'unavailable', capabilities: unavailableCapabilities() },
  { platform: 'youtube', state: 'unavailable', capabilities: unavailableCapabilities() },
];

export function canExposeAsLive(state: CapabilityState): boolean {
  return state === 'verified';
}

export function isVerificationEvidenceComplete(record: PlatformCapabilityRecord): boolean {
  const evidence = record.verificationEvidence;
  return Boolean(
    record.state === 'verified' &&
    evidence?.verifiedAt &&
    evidence.testAccountReference &&
    evidence.testRunUrl &&
    /^https:\/\//i.test(evidence.testRunUrl),
  );
}

/** Client UI should fail closed even if a malformed record claims verification. */
export function canExposeProviderAsLive(record: PlatformCapabilityRecord): boolean {
  return canExposeAsLive(record.state) && isVerificationEvidenceComplete(record);
}
