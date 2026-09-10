'use strict';

const { app, BrowserWindow, dialog } = require('electron');
const { inspectURL } = require('./url-guard');

const allowOnce = new Set();
const pending = new Set();

function navigationKey(contents, url) {
  return `${contents.id}\u0000${url}`;
}

function clearForContents(contents) {
  const prefix = `${contents.id}\u0000`;
  for (const key of allowOnce) if (key.startsWith(prefix)) allowOnce.delete(key);
  pending.delete(contents.id);
}

async function reviewNavigation(contents, event, url, isMainFrame = true) {
  if (!isMainFrame || typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
  const finding = inspectURL(url);
  if (!finding.warn) return;

  const key = navigationKey(contents, url);
  if (allowOnce.delete(key)) return;

  event.preventDefault();
  if (pending.has(contents.id)) return;
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
      buttons: ['ย้อนกลับ', 'เปิดต่อ'],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
    };
    const { response } = parent
      ? await dialog.showMessageBox(parent, options)
      : await dialog.showMessageBox(options);

    if (response === 1 && !contents.isDestroyed()) {
      allowOnce.add(key);
      await contents.loadURL(url).catch(() => {});
    }
  } finally {
    pending.delete(contents.id);
  }
}

app.on('web-contents-created', (_event, contents) => {
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
