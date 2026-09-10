# Cherry Browser 1.4 Security Foundation

This document records the hardening baseline introduced before adding more browser-security features. The goal is to make security properties testable instead of relying on comments, screenshots or memory.

## Implemented in this foundation

### Electron binary hardening

Cherry is pinned to Electron 44.3.0. `electron-builder` explicitly packages the application in ASAR and flips these Electron fuses:

- `runAsNode: false`
- `enableNodeOptionsEnvironmentVariable: false`
- `enableNodeCliInspectArguments: false`
- `enableEmbeddedAsarIntegrityValidation: true`
- `onlyLoadAppFromAsar: true`

These settings reduce ways in which a packaged Electron executable can be repurposed to execute Node.js code or load modified application code outside the expected ASAR package.

Cookie encryption is intentionally not flipped in this change. Enabling it is a one-way profile migration for Chromium cookie storage and must ship with explicit rollback/migration testing first. `grantFileProtocolExtraPrivileges` is also not changed yet because the current internal shell still boots from a local file URL; the shell should migrate to a privileged custom protocol before that fuse is tightened.

### CYRVOR URL Guard v1

`src/security-bootstrap.js` is now the Electron entry point and installs navigation protection before the existing Cherry main process creates browser contents. It then hands control to the existing `src/main.js`.

The guard covers two navigation paths:

- direct/programmatic `webContents.loadURL()` calls used by Cherry itself;
- page-initiated top-level navigation and redirects through `will-navigate` / `will-redirect`.

The first local-only heuristic engine in `src/url-guard.js` warns before navigation for high-confidence confusion patterns:

- credentials embedded in a URL;
- mixed Latin + Cyrillic/Greek characters inside the same internationalized-domain label;
- bidirectional text controls in a displayed hostname;
- login/account-like paths hosted directly on an external IP address.

Loopback IPs such as `127.0.0.1` and `::1` are exempt from the external-IP phishing warning so local development and administration pages are not hard-blocked. An HTTP login path on loopback is still classified as a review signal because the connection is unencrypted.

Punycode/IDN, unusually deep hostnames and HTTP account/login paths are marked as review signals but are not silently blocked. A high-confidence case displays **Do not open** and **Continue** choices. The check runs locally and does not send browsing URLs to a reputation service.

The bootstrap also denies `<webview>` attachment as defense in depth. Cherry continues to use `WebContentsView` with the existing sandbox and permission policy.

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
- Electron hardening fuses retained;
- URL Guard bootstrap remains the application entry point and continues to cover direct loads, page navigations and redirects.

The script is part of `npm run check`, so it runs locally and in CI.

### Deterministic CI

The stale npm lockfile found when this work started has been regenerated and committed for Electron 44.3.0. CI now installs only with `npm ci`; it does not repair or mutate dependency metadata during verification.

GitHub Actions uses the current v7 action runtime and performs:

1. locked dependency installation;
2. static and security baseline checks;
3. unit tests, including URL Guard cases;
4. the full source Electron E2E suite;
5. Windows unpacked packaging;
6. direct readback of Electron fuse states from the packaged executable;
7. a native packaged startup smoke that launches `Cherrywebbrowser.exe` without Playwright/CDP, verifies that a Cherry main window appears, verifies that an isolated schema-4 test profile is initialized, and requests a graceful window close;
8. upload of the unpacked build as a short-lived smoke-test artifact.

The binary fuse check requires `RunAsNode`, `EnableNodeOptionsEnvironmentVariable` and `EnableNodeCliInspectArguments` to be disabled, and requires `EnableEmbeddedAsarIntegrityValidation` and `OnlyLoadAppFromAsar` to be enabled. This verifies the produced executable rather than trusting only the build configuration.

The packaged binary is intentionally **not** launched through Playwright's Electron driver. Playwright documents that `electron.launch()` may time out when Electron's `EnableNodeCliInspectArguments` fuse is disabled because its Electron automation requires that debugging path. Re-enabling the fuse only to make a packaged E2E harness attach would weaken the shipped binary. The full functional E2E suite therefore runs against the source Electron runtime, while the hardened executable is independently checked through fuse readback and native startup/profile/shutdown behavior. See https://playwright.dev/docs/api/class-electron#known-issues.

A pull request should not be merged while any of these gates fail. Native interactive desktop checks can still be run locally for behaviors that depend on Windows desktop interaction.

### Dependency update discipline

Dependabot checks npm and GitHub Actions weekly. Electron updates should be merged only after the existing fullscreen, audio, Calendar, storage and source-app regression suites pass, followed by hardened packaged-binary verification.

## Next security milestones

### 1. Internal custom protocol

Move the application shell from `file://.../src/index.html` to a registered secure/standard protocol such as `cherry-app://app/`. Keep a strict path allow-list and serve only packaged application resources. After that migration passes regression tests, disable the `grantFileProtocolExtraPrivileges` fuse.

### 2. Reputation provider interface

Add a provider interface separate from AI. It should accept only the minimum URL/domain/hash material needed by the configured service, enforce HTTPS, reject redirects, apply timeouts/response limits and clearly document privacy behavior. Local CYRVOR reputation, enterprise allow/deny lists and third-party services should all fit behind the same interface.

Reputation data can raise or lower URL Guard confidence, but a heuristic or model score alone must not silently block an ordinary site. Blocking policy needs explicit rule provenance and an auditable reason.

### 3. Download Guard

Before opening a downloaded file, inspect filename, final extension, MIME metadata and file magic where practical. Flag double extensions and executable/script types. Integrate Windows Defender or an enterprise scanner through an explicit provider boundary rather than allowing an LLM to decide whether a file is safe.

### 4. Tracker protection and containers

Implement request filtering separately from the renderer UI, with observable rule/version state. Add isolated browsing containers backed by distinct Electron session partitions for work/personal/banking/research use cases. Workspaces alone are not security boundaries because their normal cookies currently share the same persistent session.

### 5. Signing and updates

Do not call an unsigned portable build a production release. Add Windows code signing and a signed update channel after certificate/secrets are provisioned. CI may build unsigned smoke-test artifacts, but release artifacts should be signed and traceable to a tagged source revision.

## AI boundary

Cherry AI remains a reading/writing assistant. Web content is untrusted input, model output is text, credentials stay out of the renderer, and the model does not receive direct browser-control or operating-system tools. Browser enforcement decisions belong to deterministic policy/reputation components with explicit user controls and auditability.
