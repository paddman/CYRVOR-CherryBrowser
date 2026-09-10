# Cherry Browser 1.4 Security Foundation

This document records the hardening baseline introduced before adding more browser-security features. The goal is to make security properties testable instead of relying on comments, screenshots or memory.

## Implemented in this foundation

### Electron binary hardening

`electron-builder` now explicitly packages the application in ASAR and flips these Electron fuses:

- `runAsNode: false`
- `enableNodeOptionsEnvironmentVariable: false`
- `enableNodeCliInspectArguments: false`
- `enableEmbeddedAsarIntegrityValidation: true`
- `onlyLoadAppFromAsar: true`

These settings reduce ways in which a packaged Electron executable can be repurposed to execute Node.js code or load modified application code outside the expected ASAR package.

Cookie encryption is intentionally not flipped in this change. Enabling it is a one-way profile migration for Chromium cookie storage and must ship with explicit rollback/migration testing first. `grantFileProtocolExtraPrivileges` is also not changed yet because the current internal shell still boots from a local file URL; the shell should migrate to a privileged custom protocol before that fuse is tightened.

### Security regression gate

`scripts/security-baseline.js` fails when critical protections disappear, including:

- Node integration disabled;
- context isolation and sandbox enabled;
- guest `webSecurity` enabled;
- insecure mixed execution disabled;
- IPC sender validation present;
- explicit permission check/request handlers present;
- popup policy present;
- restrictive internal CSP present;
- AI provider redirects disabled, HTTPS enforced for remote providers, finite timeouts and response limits retained;
- Electron hardening fuses retained.

The script is part of `npm run check`, so it runs locally and in CI.

### CI

GitHub Actions now performs `npm ci`, static/security checks, unit tests and a Windows unpacked build. The build artifact is retained briefly for smoke testing. E2E/native GUI tests remain local for now because hosted Windows runners are not a reliable substitute for an interactive desktop session.

### Dependency update discipline

Dependabot checks npm and GitHub Actions weekly. Electron updates should be merged only after the existing fullscreen, audio, Calendar, storage and packaged-app regression suites pass.

## Next security milestones

### 1. Internal custom protocol

Move the application shell from `file://.../src/index.html` to a registered secure/standard protocol such as `cherry-app://app/`. Keep a strict path allow-list and serve only packaged application resources. After that migration passes regression tests, disable the `grantFileProtocolExtraPrivileges` fuse.

### 2. CYRVOR URL Guard

Add a navigation decision layer before any guest load. The first local-only version should identify high-confidence hazards without pretending to be a cloud reputation service:

- embedded URL credentials;
- Unicode/IDN display confusion and mixed-script hostnames;
- suspicious IP-literal login URLs;
- known dangerous schemes and malformed navigation;
- excessive redirect chains;
- HTTP pages requesting sensitive permissions;
- lookalike-domain heuristics with a clear explanation rather than silent blocking.

Suspicious cases should use an interstitial with **Back** and an explicit **Continue anyway** action. A heuristic score alone must never silently block an ordinary site.

### 3. Reputation provider interface

Add a provider interface separate from AI. It should accept only the minimum URL/domain/hash material needed by the configured service, enforce HTTPS, reject redirects, apply timeouts/response limits and clearly document privacy behavior. Local CYRVOR reputation, enterprise allow/deny lists and third-party services should all fit behind the same interface.

### 4. Download Guard

Before opening a downloaded file, inspect filename, final extension, MIME metadata and file magic where practical. Flag double extensions and executable/script types. Integrate Windows Defender or an enterprise scanner through an explicit provider boundary rather than allowing an LLM to decide whether a file is safe.

### 5. Tracker protection and containers

Implement request filtering separately from the renderer UI, with observable rule/version state. Add isolated browsing containers backed by distinct Electron session partitions for work/personal/banking/research use cases. Workspaces alone are not security boundaries because their normal cookies currently share the same persistent session.

### 6. Signing and updates

Do not call an unsigned portable build a production release. Add Windows code signing and a signed update channel after certificate/secrets are provisioned. CI may build unsigned smoke-test artifacts, but release artifacts should be signed and traceable to a tagged source revision.

## AI boundary

Cherry AI remains a reading/writing assistant. Web content is untrusted input, model output is text, credentials stay out of the renderer, and the model does not receive direct browser-control or operating-system tools. Browser enforcement decisions belong to deterministic policy/reputation components with explicit user controls and auditability.
