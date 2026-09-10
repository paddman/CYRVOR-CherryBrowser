'use strict';

const { app, BrowserWindow, dialog } = require('electron');
const { inspectURL } = require('./url-guard');

const allowOnce = new Set();
const pending = new Set();

function navigationKey(contents, url) {
  return `${contents.id}\u0000${url}`;
}

function grantBypass(key) {
  allowOnce.add(key);
  const timer = setTimeout(() => allowOnce.delete(key), 1500);
  timer.unref?.();
}

function consumeBypass(contents, url) {
  return allowOnce.delete(navigationKey(contents, url));
}

function clearForContents(contents) {
  const prefix = `${contents.id}\u0000`;
  for (const key of allowOnce) if (key.startsWith(prefix)) allowOnce.delete(key);
  pending.delete(contents.id);
}

async function confirmNavigation(contents, url, finding) {
  if (pending.has(contents.id)) return false;
  pending.add(contents.id);
  try {
    const parent = BrowserWindow.fromWebContents(contents) || BrowserWindow.getAllWindows()[0];
    const detail = [
      `ปลายทาง: ${finding.displayHost || url}`,
      '',
      ...finding.reasons.map(reason => `• ${reason}`),
      '',
      'การตรวจนี้ทำในเครื่องและไม่ได้ส่ง URL ไปยังบริการภายนอก',
    ].join('\n');
    const options = {
      type: 'warning',
      title: 'CYRVOR URL Guard',
      message: 'Cherry พบลักษณะ URL ที่อาจทำให้ผู้ใช้เข้าใจปลายทางผิด',
      detail,
      buttons: ['ไม่เปิด', 'เปิดต่อ'],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
    };
    const { response } = parent
      ? await dialog.showMessageBox(parent, options)
      : await dialog.showMessageBox(options);
    return response === 1 && !contents.isDestroyed();
  } finally {
    pending.delete(contents.id);
  }
}

async function reviewNavigation(contents, event, url, isMainFrame = true) {
  if (!isMainFrame || typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
  if (consumeBypass(contents, url)) return;

  const finding = inspectURL(url);
  if (!finding.warn) return;

  event.preventDefault();
  const allowed = await confirmNavigation(contents, url, finding);
  if (!allowed || contents.isDestroyed()) return;

  const key = navigationKey(contents, url);
  grantBypass(key);
  await contents.loadURL(url).catch(() => {});
}

function protectProgrammaticLoads(contents) {
  const nativeLoadURL = contents.loadURL.bind(contents);
  contents.loadURL = async (url, options) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url) && !consumeBypass(contents, url)) {
      const finding = inspectURL(url);
      if (finding.warn) {
        const allowed = await confirmNavigation(contents, url, finding);
        if (!allowed) {
          const error = new Error('CYRVOR URL Guard blocked this navigation by user choice');
          error.code = 'CYRVOR URL Guard · ไม่ได้เปิด URL นี้ตามที่ผู้ใช้เลือก';
          throw error;
        }
        grantBypass(navigationKey(contents, url));
      }
    }
    return nativeLoadURL(url, options);
  };
}

app.on('web-contents-created', (_event, contents) => {
  protectProgrammaticLoads(contents);
  contents.on('will-attach-webview', event => event.preventDefault());
  contents.on('will-navigate', (event, url) => {
    reviewNavigation(contents, event, url, true).catch(() => {});
  });
  contents.on('will-redirect', (event, url, _isInPlace, isMainFrame) => {
    reviewNavigation(contents, event, url, isMainFrame).catch(() => {});
  });
  contents.once('destroyed', () => clearForContents(contents));
});

require('./main');
