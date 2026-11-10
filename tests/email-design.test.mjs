import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readEmailDesign, serializeEmailDesign, hasEmailContent } from '../src/features/email-editor/utils/emailDesign.ts';

test('editor design survives JSON persistence and reopening', () => {
  const document = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome {{name}}' }] }] };
  assert.deepEqual(readEmailDesign(serializeEmailDesign(document)), document);
});
test('legacy, invalid and unknown-version designs fall back to their original HTML', () => {
  for (const value of [undefined, '', '{', '{}', '{"body":{"rows":[]}}', '{"editor":"react-email","version":2,"document":{"type":"doc","content":[]}}']) assert.equal(readEmailDesign(value), null);
});
test('empty HTML wrappers and styles cannot masquerade as email content', () => {
  assert.equal(hasEmailContent('<html><head><title>Template</title></head><body><style>p { color: red }</style><p>&nbsp;</p></body></html>'), false);
  assert.equal(hasEmailContent('<p>Welcome</p>'), true);
  assert.equal(hasEmailContent('<img src="https://example.com/logo.png" alt="Brand"/>'), true);
});
