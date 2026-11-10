import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newAutomationDraft, newMessageStep, validateTrigger, validateMessage, toAutomationRequest } from '../src/features/automations/utils/automationDraft.ts';
import { previewDocument } from '../src/features/automations/utils/emailPreview.ts';

const eventDraft = () => ({ ...newAutomationDraft(), name: 'Welcome', eventName: 'user.created', steps: [{ ...newMessageStep(), recipient: '{{email}}', subject: 'Welcome {{name}}', body: '<h1>Hello {{name}}</h1>' }] });

test('event workflow preserves copied template HTML and variables in activation payload', () => {
  const draft = eventDraft();
  assert.equal(validateTrigger(draft), '');
  assert.equal(validateMessage(draft.steps[0], 0, draft), '');
  const request = toAutomationRequest(draft);
  assert.equal(request.eventName, 'user.created');
  assert.equal(request.nextRunAt, undefined);
  assert.equal(request.steps[0].subject, 'Welcome {{name}}');
  assert.equal(request.steps[0].body, '<h1>Hello {{name}}</h1>');
  assert.equal(request.steps[0].sender, undefined);
});

test('scheduled workflow rejects invalid dates, elapsed starts and fractional recurrence', () => {
  const draft = { ...eventDraft(), trigger: 'schedule', nextRunAt: '' };
  assert.match(validateTrigger(draft), /future/);
  draft.nextRunAt = '2020-01-01T12:00';
  assert.match(validateTrigger(draft), /future/);
  draft.nextRunAt = '2030-01-01T12:00';
  draft.repeatMinutes = 1.5;
  assert.match(validateTrigger(draft), /whole number/);
  draft.repeatMinutes = 60;
  assert.equal(validateTrigger(draft), '');
  const payload = toAutomationRequest(draft);
  assert.equal(payload.repeatSeconds, 3600);
  assert.equal(payload.eventName, undefined);
  assert.equal(payload.nextRunAt, new Date(draft.nextRunAt).toISOString());
});

test('template variables cannot silently fail in a scheduled or immediate workflow', () => {
  const draft = eventDraft();
  draft.trigger = 'now';
  assert.match(validateMessage(draft.steps[0], 0, draft), /replace template variables/);
  draft.steps[0] = { ...draft.steps[0], recipient: 'person@example.com', subject: 'Welcome', body: '<h1>Hello</h1>' };
  assert.equal(validateMessage(draft.steps[0], 0, draft), '');
});

test('conditional message checks deduplicated recipient count and payload normalizes first condition', () => {
  const draft = eventDraft();
  draft.steps.push({ ...newMessageStep(), channel: 'SMS', recipient: '+2348012345678, +2348012345678', sender: 'Pingstack', body: 'Welcome', condition: 'PREVIOUS_FAILED' });
  assert.equal(validateMessage(draft.steps[1], 1, draft), '');
  draft.steps[1].recipient += ',+2348098765432';
  assert.match(validateMessage(draft.steps[1], 1, draft), /same recipient count/);
  draft.steps[0].condition = 'PREVIOUS_FAILED';
  assert.equal(toAutomationRequest(draft).steps[0].condition, 'ALWAYS');
});

test('message validation catches missing content, sender and invalid delay', () => {
  const draft = eventDraft();
  const sms = { ...newMessageStep(), channel: 'SMS', recipient: '+2348012345678' };
  assert.match(validateMessage(sms, 0, draft), /sender ID/);
  sms.sender = 'Pingstack';
  assert.match(validateMessage(sms, 0, draft), /write your message/);
  sms.body = 'Hello'; sms.delaySeconds = -1;
  assert.match(validateMessage(sms, 0, draft), /valid delay/);
});

test('new drafts and message steps do not share mutable content', () => {
  const first = newAutomationDraft();
  first.steps[0].body = 'Changed';
  assert.equal(newAutomationDraft().steps[0].body, '');
});

test('email previews restrict scripts, forms and network resources with a CSP', () => {
  const html = previewDocument('<h1>Hello</h1>');
  assert.match(html, /default-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /<h1>Hello<\/h1>/);
});
