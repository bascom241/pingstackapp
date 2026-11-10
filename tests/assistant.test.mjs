import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAutomationProposal } from '../src/features/assistant/utils/automationProposal.ts';
const draft = () => ({ name: 'Welcome', trigger: 'event', eventName: 'user.created', nextRunAt: '', repeatMinutes: 0, steps: [{ channel: 'EMAIL', recipient: '{{email}}', sender: '', subject: 'Hello', body: '<p>Hello</p>', delaySeconds: 0, transactional: false, condition: 'ALWAYS' }] });
test('assistant proposals become editable drafts while keeping validation in the builder', () => {
  const input = draft(); input.steps[0].recipient = '';
  assert.equal(readAutomationProposal(input).steps[0].recipient, '');
  input.steps[0].condition = 'PREVIOUS_FAILED';
  assert.equal(readAutomationProposal(input).steps[0].condition, 'ALWAYS');
});
test('malformed assistant proposals cannot reach the automation builder', () => {
  for (const value of [null, '<script>', {}, { ...draft(), steps: [] }, { ...draft(), steps: Array(21).fill(draft().steps[0]) }, { ...draft(), trigger: 'activate' }]) assert.equal(readAutomationProposal(value), null);
  const invalid = draft(); invalid.steps[0].delaySeconds = -1;
  assert.equal(readAutomationProposal(invalid), null);
});
test('scheduled proposal time is converted to a local datetime input without changing the instant', () => {
  const input = { ...draft(), trigger: 'schedule', nextRunAt: '2030-01-15T10:00:00Z' };
  const output = readAutomationProposal(input);
  assert.equal(new Date(output.nextRunAt).getTime(), new Date(input.nextRunAt).getTime());
});
