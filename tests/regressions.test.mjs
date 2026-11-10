import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { calculateSmsSegments } from '../src/utils/smsSegments.ts';
import { apiUrl, API_BASE_URL } from '../src/api/config.ts';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
globalThis.window = { location: { origin: 'https://app.test', pathname: '/dashboard/sms', search: '', href: '' } };
let dispatch;
axios.defaults.adapter = config => dispatch(config);
const { axiosInstance } = await import('../src/api/axios.ts');
const { getEntireAudience, deleteSubscriber } = await import('../src/features/contacts/api/subscriber.ts');
const response = (config, data) => ({ config, data, status: 200, statusText: 'OK', headers: {} });
const fail = (config, status = 401, data = {}) => Promise.reject(new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, { config, status, data, headers: {}, statusText: 'Error' }));
beforeEach(() => {
  storage.clear();
  storage.set('accessToken', 'old');
  storage.set('refreshToken', 'refresh');
  window.location.href = '';
});

test('SMS counts GSM boundaries, extension characters, Unicode, emoji and empty input', () => {
  for (const [text, encoding, units, segments] of [
    ['', 'GSM-7', 0, 0], ['a'.repeat(160), 'GSM-7', 160, 1],
    ['a'.repeat(161), 'GSM-7', 161, 2], ['^'.repeat(80), 'GSM-7', 160, 1],
    ['^'.repeat(153), 'GSM-7', 306, 3], ['漢'.repeat(70), 'UCS-2', 70, 1],
    ['漢'.repeat(71), 'UCS-2', 71, 2], ['😀'.repeat(35), 'UCS-2', 70, 1],
    ['😀'.repeat(67), 'UCS-2', 134, 3], ['hello €', 'GSM-7', 8, 1],
  ]) {
    const result = calculateSmsSegments(text);
    assert.equal(result.encoding, encoding);
    assert.equal(result.units, units);
    assert.equal(result.segments, segments);
  }
});

test('configured API prefix is shared and slash-normalized', () => {
  assert.equal(API_BASE_URL, 'https://api.test/prefix');
  assert.equal(axiosInstance.defaults.baseURL, API_BASE_URL);
  assert.equal(apiUrl('/v1/sms/send'), 'https://api.test/prefix/v1/sms/send');
});

test('concurrent unauthorized requests share one refresh and replay with the new token', async () => {
  let refreshes = 0;
  dispatch = async config => {
    if (config.url === '/auth/refresh') {
      refreshes++;
      await new Promise(resolve => setImmediate(resolve));
      return response(config, { data: { accessToken: 'new', refreshToken: 'rotated' } });
    }
    if (config.headers.get('Authorization') === 'Bearer old') return fail(config);
    assert.equal(config.headers.get('Authorization'), 'Bearer new');
    return response(config, 'ok');
  };
  const results = await Promise.all([axiosInstance.get('/one'), axiosInstance.get('/two')]);
  assert.equal(refreshes, 1);
  assert.deepEqual(results.map(result => result.data), ['ok', 'ok']);
  assert.equal(storage.get('refreshToken'), 'rotated');
});

test('public auth errors and ordinary 403 errors never refresh', async () => {
  const calls = [];
  dispatch = config => { calls.push(config.url); return fail(config, config.url === '/private' ? 403 : 401); };
  await assert.rejects(axiosInstance.post('/auth/login?source=test'));
  await assert.rejects(axiosInstance.get('/private'));
  assert.deepEqual(calls, ['/auth/login?source=test', '/private']);
  assert.equal(window.location.href, '');
});

test('failed refresh rejects all waiting requests and clears the session', async () => {
  let refreshes = 0;
  dispatch = async config => {
    if (config.url === '/auth/refresh') {
      refreshes++;
      await new Promise(resolve => setImmediate(resolve));
    }
    return fail(config);
  };
  const results = await Promise.allSettled([axiosInstance.get('/one'), axiosInstance.get('/two')]);
  assert.ok(results.every(result => result.status === 'rejected'));
  assert.equal(refreshes, 1);
  assert.equal(storage.get('accessToken'), undefined);
  assert.match(window.location.href, /^\/login\?redirect=/);
});

test('missing refresh token rejects without making a refresh call', async () => {
  storage.delete('refreshToken');
  const calls = [];
  dispatch = config => { calls.push(config.url); return fail(config); };
  await assert.rejects(axiosInstance.get('/private'));
  assert.deepEqual(calls, ['/private']);
  assert.equal(storage.get('accessToken'), undefined);
});

test('retried unauthorized requests stop after one refresh', async () => {
  let refreshes = 0;
  dispatch = config => config.url === '/auth/refresh'
    ? (refreshes++, Promise.resolve(response(config, { data: { accessToken: 'new' } })))
    : fail(config);
  await assert.rejects(axiosInstance.get('/private'));
  assert.equal(refreshes, 1);
  assert.equal(storage.get('accessToken'), undefined);
});

test('audience loading follows every page even when server caps page size', async () => {
  const pages = [];
  dispatch = async config => {
    pages.push(config.params.page);
    assert.equal(config.params.listId, 'audience-A');
    return response(config, { totalPages: 3, content: Array.from({ length: 20 }, (_, i) => ({ destinationNumber: String(config.params.page * 20 + i) })) });
  };
  assert.equal((await getEntireAudience('audience-A')).length, 60);
  assert.deepEqual(pages, [0, 1, 2]);
});

test('audience failure never returns a partially loaded list', async () => {
  dispatch = async config => config.params.page === 0
    ? response(config, { totalPages: 2, content: [{ destinationNumber: '+123456789' }] })
    : fail(config, 500);
  await assert.rejects(getEntireAudience('audience-A'));
});

test('empty and malformed audience responses are handled explicitly', async () => {
  dispatch = async config => response(config, { totalPages: 0, content: [] });
  assert.deepEqual(await getEntireAudience('empty'), []);
  dispatch = async config => response(config, { content: [] });
  await assert.rejects(getEntireAudience('broken'), /pagination/);
});

test('deletion sends the explicit subscriber and audience IDs for each call', async () => {
  const deleted = [];
  dispatch = async config => { deleted.push(config.params); return response(config, null); };
  await deleteSubscriber('first', 'audience-A');
  await deleteSubscriber('second', 'audience-B');
  assert.deepEqual(deleted, [{ subscriberId: 'first', audienceId: 'audience-A' }, { subscriberId: 'second', audienceId: 'audience-B' }]);
});
