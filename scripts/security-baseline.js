'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pkg = JSON.parse(read('package.json'));
const bootstrap = read('src/security-bootstrap.js');
const urlGuard = read('src/url-guard.js');
const main = read('src/main.js');
const preload = read('src/preload.js');
const index = read('src/index.html');
const providers = read('src/providers.js');

const failures = [];
function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

function forbid(source, pattern, message) {
  requireCondition(!pattern.test(source), message);
}

const fuses = pkg.build?.electronFuses || {};
requireCondition(pkg.main === 'src/security-bootstrap.js', 'security bootstrap must remain the Electron entry point');
requireCondition(pkg.build?.asar === true, 'electron-builder must package source inside app.asar');
requireCondition(fuses.runAsNode === false, 'Electron fuse runAsNode must remain disabled');
requireCondition(fuses.enableNodeOptionsEnvironmentVariable === false, 'Electron fuse NODE_OPTIONS must remain disabled');
requireCondition(fuses.enableNodeCliInspectArguments === false, 'Electron fuse CLI inspect arguments must remain disabled');
requireCondition(fuses.enableEmbeddedAsarIntegrityValidation === true, 'Embedded ASAR integrity validation must remain enabled');
requireCondition(fuses.onlyLoadAppFromAsar === true, 'Electron must only load application code from app.asar');

for (const [file, source] of [['src/main.js', main], ['src/preload.js', preload]]) {
  forbid(source, /nodeIntegration\s*:\s*true\b/, `${file}: nodeIntegration:true is forbidden`);
  forbid(source, /contextIsolation\s*:\s*false\b/, `${file}: contextIsolation:false is forbidden`);
  forbid(source, /sandbox\s*:\s*false\b/, `${file}: sandbox:false is forbidden`);
}
forbid(main, /webSecurity\s*:\s*false\b/, 'src/main.js: webSecurity:false is forbidden');
forbid(main, /allowRunningInsecureContent\s*:\s*true\b/, 'src/main.js: allowRunningInsecureContent:true is forbidden');
forbid(preload, /\brequire\s*\(\s*['\"]@electron\/remote['\"]\s*\)/, 'src/preload.js: @electron/remote is forbidden');
forbid(preload, /\bremote\s*\./, 'src/preload.js: Electron remote API is forbidden');

requireCondition(main.includes("contextIsolation: true"), 'Browser windows/views must keep contextIsolation enabled');
requireCondition(main.includes("nodeIntegration: false"), 'Browser windows/views must keep nodeIntegration disabled');
requireCondition(main.includes("sandbox: true"), 'Browser windows/views must keep sandbox enabled');
requireCondition(main.includes("webSecurity: true"), 'Guest browsing views must keep webSecurity enabled');
requireCondition(main.includes("allowRunningInsecureContent: false"), 'Guest browsing views must reject insecure mixed execution');
requireCondition(main.includes('setPermissionCheckHandler'), 'Session permission check handler is required');
requireCondition(main.includes('setPermissionRequestHandler'), 'Session permission request handler is required');
requireCondition(main.includes('setWindowOpenHandler'), 'Popup/window-open policy is required');
requireCondition(main.includes('function trusted(event)'), 'IPC sender validation is required');
requireCondition(main.includes("event.senderFrame === win.webContents.mainFrame"), 'IPC validation must bind commands to the top-level Cherry UI frame');

requireCondition(bootstrap.includes("app.on('web-contents-created'"), 'URL Guard must attach before Cherry main process creates browsing contents');
requireCondition(bootstrap.includes("contents.on('will-navigate'"), 'URL Guard must inspect top-level navigations');
requireCondition(bootstrap.includes("contents.on('will-redirect'"), 'URL Guard must inspect redirects');
requireCondition(bootstrap.includes("contents.on('will-attach-webview'"), 'webview attachment must remain denied');
requireCondition(bootstrap.includes("require('./main')"), 'security bootstrap must hand off to the normal Cherry main process');
requireCondition(urlGuard.includes('hasMixedConfusableScript'), 'URL Guard mixed-script detection is required');
requireCondition(urlGuard.includes('url.username || url.password'), 'URL Guard credential-in-URL detection is required');

requireCondition(preload.includes('contextBridge.exposeInMainWorld'), 'Preload must expose a narrow contextBridge API');
requireCondition(!preload.includes('webFrame.executeJavaScript'), 'Preload must not expose arbitrary script execution');

for (const directive of [
  "default-src 'self'",
  "script-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
]) {
  requireCondition(index.includes(directive), `Internal UI CSP must contain: ${directive}`);
}

requireCondition(providers.includes("redirect: 'error'"), 'AI provider HTTP redirects must stay disabled');
requireCondition(providers.includes('AbortSignal.timeout(45000)'), 'AI provider requests must retain a finite timeout');
requireCondition(providers.includes("url.protocol !== 'https:'"), 'Remote AI endpoints must require HTTPS');
requireCondition(providers.includes('size > 2_000_000'), 'AI provider response size limit is required');

const exactVersions = ['electron', 'electron-builder', '@playwright/test'];
for (const dependency of exactVersions) {
  const version = pkg.devDependencies?.[dependency];
  requireCondition(typeof version === 'string' && !/^[~^*><=]/.test(version), `${dependency} must be pinned to an exact version`);
}

if (failures.length) {
  console.error(`Cherry security baseline failed (${failures.length}):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('Cherry security baseline OK');
console.log('Protected invariants: sandbox, context isolation, IPC trust boundary, permissions, CSP, provider transport, Electron fuses, local URL Guard.');
