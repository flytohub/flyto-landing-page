import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeHtmlEntities,
  escapeMarkdownCell,
  htmlToText,
  isExternalHttpLink,
  isInternalSiteLink,
} from './content-safety.mjs';

test('HTML entities are decoded exactly once', () => {
  assert.equal(decodeHtmlEntities('&amp;lt;Flyto2&amp;gt;'), '&lt;Flyto2&gt;');
  assert.equal(decodeHtmlEntities('&quot;Flyto2&#x27;'), '"Flyto2\'');
});

test('HTML text extraction removes malformed raw-text closing tags', () => {
  const html = '<p>Before</p><script>alert(1)</script\t\n bar><style>.hidden{}</style\t data-x>After';
  assert.equal(htmlToText(html), 'Before After');
  assert.equal(htmlToText('<script>unterminated'), '');
  assert.equal(htmlToText('<scripture>Safe text</scripture>'), 'Safe text');
});

test('site link classification compares parsed origins', () => {
  const origin = 'https://flyto2.com';
  assert.equal(isInternalSiteLink('/support/', origin), true);
  assert.equal(isInternalSiteLink('https://flyto2.com/privacy/', origin), true);
  assert.equal(isInternalSiteLink('https://flyto2.com.attacker.example/', origin), false);
  assert.equal(isExternalHttpLink('https://flyto2.com.attacker.example/', origin), true);
  assert.equal(isExternalHttpLink('javascript:alert(1)', origin), false);
});

test('Markdown cells escape existing backslashes and pipes', () => {
  assert.equal(escapeMarkdownCell(String.raw`C:\Flyto2|Runner`), String.raw`C:\\Flyto2\|Runner`);
});
