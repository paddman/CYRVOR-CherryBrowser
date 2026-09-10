# Cherry Browser Security Policy

Cherry is a desktop browser, so security bugs can cross a much more serious boundary than an ordinary web UI bug. Please avoid publishing exploit details before a fix is available.

## Supported code

Security fixes target the current `main` branch and the newest published Cherry Browser release. Old portable builds are not considered supported once a replacement release is published.

## Reporting a vulnerability

Prefer GitHub's private **Report a vulnerability** / Security Advisory flow when it is available for this repository. Include:

- affected Cherry version and Windows version;
- exact reproduction steps;
- whether the issue crosses the renderer/main-process boundary;
- whether a malicious website can trigger it without local access;
- minimal proof-of-concept material needed to reproduce;
- expected security impact.

Do not include API keys, OAuth tokens, cookies, private browsing data, personal documents, or third-party credentials in a report.

If private vulnerability reporting is unavailable, create only a minimal public issue asking for a private reporting channel. Do not paste working exploit code or victim data into a public issue.

## Security invariants

The following are treated as release-blocking invariants:

- guest websites run with Node integration disabled, context isolation enabled, sandbox enabled and `webSecurity` enabled;
- the Cherry shell validates IPC senders before accepting commands;
- website permission requests are allow-listed and tied to the requesting HTTPS origin;
- AI credentials stay in the main process and protected storage;
- remote AI endpoints require HTTPS and redirects are rejected;
- the internal shell has a restrictive Content Security Policy;
- packaged Electron binaries disable dangerous runtime fuses and require application code from ASAR.

`npm run security:check` verifies these invariants and CI must pass before merging security-sensitive changes.
