'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hasMixedConfusableScript, inspectURL } = require('../src/url-guard');

test('normal HTTPS navigation is not warned', () => {
  const result = inspectURL('https://github.com/paddman/CYRVOR-CherryBrowser');
  assert.equal(result.severity, 'normal');
  assert.equal(result.warn, false);
});

test('credential-in-URL confusion triggers a local warning', () => {
  const result = inspectURL('https://trusted.example:secret@evil.example/login');
  assert.equal(result.severity, 'high');
  assert.equal(result.warn, true);
  assert.ok(result.reasons.some(reason => reason.includes('ชื่อผู้ใช้')));
});

test('mixed Latin and Cyrillic lookalike label triggers a warning', () => {
  const lookalike = 'раypal.com'; // Cyrillic р/а followed by Latin ypal.
  assert.equal(hasMixedConfusableScript(new URL(`https://${lookalike}/`).hostname), true);
  const result = inspectURL(`https://${lookalike}/login`);
  assert.equal(result.severity, 'high');
  assert.equal(result.warn, true);
});

test('single-script internationalized domain is not treated as mixed-script phishing', () => {
  const result = inspectURL('https://ภาษาไทย.ไทย/');
  assert.notEqual(result.severity, 'high');
  assert.equal(result.warn, false);
});

test('external IP-literal login URL warns while ordinary IP content remains usable', () => {
  assert.equal(inspectURL('https://203.0.113.10/login').warn, true);
  assert.equal(inspectURL('https://203.0.113.10/status').warn, false);
});

test('loopback IP login is review-only so local development is not blocked', () => {
  const ipv4 = inspectURL('http://127.0.0.1:8080/login');
  const ipv6 = inspectURL('http://[::1]:8080/login');
  assert.equal(ipv4.warn, false);
  assert.equal(ipv4.severity, 'medium');
  assert.equal(ipv6.warn, false);
  assert.equal(ipv6.severity, 'medium');
});

test('HTTP sensitive pages are marked for review but not silently blocked', () => {
  const result = inspectURL('http://example.com/account/login');
  assert.equal(result.severity, 'medium');
  assert.equal(result.warn, false);
  assert.ok(result.reasons.some(reason => reason.includes('HTTP')));
});
