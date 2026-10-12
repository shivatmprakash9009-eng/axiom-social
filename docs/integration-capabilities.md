# Connector Verification Checklist

Do not expose a feature as available until it passes this checklist for the client's intended account type.

## Shared checklist

- [ ] Current official developer documentation reviewed
- [ ] Business/creator/channel account eligibility confirmed
- [ ] Developer app created and configured
- [ ] Exact OAuth scopes and review requirements documented
- [ ] Redirect, state/CSRF, code exchange and refresh flow tested
- [ ] Token storage is server-side and encrypted
- [ ] Publish workflow tested against an authorized test account
- [ ] Rate limits and quota usage surfaced
- [ ] Expired/revoked access and user disconnect handled
- [ ] Network timeout and provider 4xx/5xx handled
- [ ] Ambiguous publish result reconciled before retry
- [ ] Independent per-platform job status and audit trail verified
- [ ] Manual testing and automated tests recorded

## Instagram

Verify professional-account requirements, publishing surfaces/media constraints, eligible comment operations, and messaging scopes individually. Do not assume direct messages are included because publishing works.

## YouTube

Verify OAuth scopes, channel/account authorization, upload API requirements, quota cost, metadata/visibility fields, scheduling behavior and any project verification/audit restriction for public uploads.

## Acceptance evidence

For each connector keep: test account type, approved scopes, timestamped test result, sanitized provider response, job ID, resulting content identifier/link when provided, quota observations, and known limitations. Never log access tokens or private content unnecessarily.
