'use strict';

const net = require('node:net');
const { domainToUnicode } = require('node:url');

const SENSITIVE_PATH = /(?:^|[\/_?&.=-])(login|signin|sign-in|account|verify|verification|password|passwd|wallet|bank|billing|payment|secure|auth|oauth)(?:$|[\/_?&.=-])/i;
const BIDI_CONTROL = /[\u202A-\u202E\u2066-\u2069]/u;

function scriptSet(value) {
  const scripts = new Set();
  for (const char of value.normalize('NFKC')) {
    const code = char.codePointAt(0);
    if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a) || (code >= 0x00c0 && code <= 0x024f)) scripts.add('latin');
    else if (code >= 0x0370 && code <= 0x03ff) scripts.add('greek');
    else if (code >= 0x0400 && code <= 0x052f) scripts.add('cyrillic');
  }
  return scripts;
}

function hasMixedConfusableScript(hostname) {
  return hostname.split('.').some(label => {
    const scripts = scriptSet(domainToUnicode(label));
    return scripts.has('latin') && (scripts.has('cyrillic') || scripts.has('greek'));
  });
}

function isLoopbackIP(hostname) {
  const host = String(hostname || '').toLowerCase();
  return host === '::1' || host.startsWith('127.');
}

function inspectURL(value) {
  let url;
  try { url = new URL(String(value)); }
  catch {
    return { severity: 'high', warn: true, code: 'invalid-url', reasons: ['URL ไม่ถูกต้อง'], displayHost: '' };
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return { severity: 'high', warn: true, code: 'unsupported-scheme', reasons: [`ไม่อนุญาต scheme ${url.protocol}`], displayHost: url.hostname };
  }

  const reasons = [];
  const high = [];
  const unicodeHost = domainToUnicode(url.hostname);
  const ipHost = url.hostname.replace(/^\[|\]$/g, '');
  const sensitive = SENSITIVE_PATH.test(`${url.pathname}${url.search}`);

  if (url.username || url.password) high.push('URL ฝังชื่อผู้ใช้หรือรหัสผ่าน ซึ่งอาจทำให้โดเมนปลายทางดูสับสน');
  if (BIDI_CONTROL.test(unicodeHost)) high.push('ชื่อโดเมนมีอักขระควบคุมทิศทางข้อความที่อาจใช้ซ่อนชื่อจริง');
  if (hasMixedConfusableScript(url.hostname)) high.push('ชื่อโดเมนผสม Latin กับ Cyrillic/Greek ใน label เดียวกัน คล้ายเทคนิค homograph phishing');
  if (net.isIP(ipHost) && !isLoopbackIP(ipHost) && sensitive) high.push('หน้า login/บัญชีใช้ IP address โดยตรงแทนชื่อโดเมน');

  if (url.hostname.split('.').some(label => label.startsWith('xn--'))) reasons.push('โดเมน IDN/Punycode ควรตรวจชื่อปลายทางให้ชัดเจน');
  if (url.protocol === 'http:' && sensitive) reasons.push('หน้าที่ดูเกี่ยวกับบัญชีหรือการเข้าสู่ระบบกำลังใช้ HTTP ที่ไม่เข้ารหัส');
  if (url.hostname.length > 100 || url.hostname.split('.').length > 7) reasons.push('ชื่อโฮสต์ยาวหรือซ้อน subdomain มากผิดปกติ');

  if (high.length) {
    return { severity: 'high', warn: true, code: 'suspicious-navigation', reasons: [...high, ...reasons], displayHost: unicodeHost || url.hostname };
  }
  if (reasons.length) {
    return { severity: 'medium', warn: false, code: 'review-navigation', reasons, displayHost: unicodeHost || url.hostname };
  }
  return { severity: 'normal', warn: false, code: 'normal', reasons: [], displayHost: unicodeHost || url.hostname };
}

module.exports = { hasMixedConfusableScript, inspectURL, scriptSet };
