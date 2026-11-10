import { useRef, useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DeveloperPage, DeveloperCard, CodeBlock } from '../../components/developers/DeveloperUI';
import { axiosInstance } from '../../api/axios';
import { apiUrl } from '../../api/config';
import { getApiErrorMessage } from '../../utils/apiError';

export default function OtpGuide() {
  const [channel, setChannel] = useState<'SMS' | 'EMAIL'>('SMS');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [challenge, setChallenge] = useState<{ challengeId: string; expiresAt: string } | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const request = useRef<{ fingerprint: string; key: string } | null>(null);
  const send = useMutation({
    mutationFn: async () => {
      const payload = { channel, recipient, sender: sender || undefined };
      const fingerprint = JSON.stringify(payload);
      if (request.current?.fingerprint !== fingerprint) request.current = { fingerprint, key: crypto.randomUUID() };
      return (await axiosInstance.post<{ challengeId: string; expiresAt: string }>('/otp/request', payload, { headers: { 'Idempotency-Key': request.current.key } })).data;
    },
    onSuccess: result => { setChallenge(result); setCode(''); setFeedback('Verification code queued for delivery. Enter the code received by the recipient.'); },
    onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const verify = useMutation({
    mutationFn: async () => (await axiosInstance.post<{ verified: boolean; attemptsRemaining?: number; message?: string }>('/otp/verify', { challengeId: challenge?.challengeId, code })).data,
    onSuccess: result => setFeedback(result.verified ? 'Code verified successfully.' : result.message || `Invalid code. ${result.attemptsRemaining} attempts remaining.`),
    onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const submit = (event: FormEvent) => { event.preventDefault(); send.mutate(); };
  const sample = JSON.stringify({ channel, recipient: recipient || (channel === 'SMS' ? '2348012345678' : 'you@example.com'), sender: sender || undefined }, null, 2);
  return <DeveloperPage title="OTP verification" description="Send real verification codes through SMS or email and verify them using the API.">
    <div className="dev-stack">
      <DeveloperCard title="Send a verification code" description="Codes expire after five minutes and allow five verification attempts. SMS uses your approved sender and wallet balance."><form onSubmit={submit} className="dev-card-body dev-stack">
        <div className="dev-field"><label htmlFor="otp-channel">Channel</label><select id="otp-channel" value={channel} onChange={event => { setChannel(event.target.value as 'SMS' | 'EMAIL'); setChallenge(null); }} className="dev-input"><option value="SMS">SMS</option><option value="EMAIL">Email</option></select></div>
        <div className="dev-field"><label htmlFor="otp-recipient">Recipient</label><input id="otp-recipient" type={channel === 'SMS' ? 'tel' : 'email'} required value={recipient} onChange={event => { setRecipient(event.target.value); setChallenge(null); }} className="dev-input" placeholder={channel === 'SMS' ? '+2348012345678' : 'you@example.com'} /></div>
        <div className="dev-field"><label htmlFor="otp-sender">{channel === 'SMS' ? 'Approved sender ID' : 'Sender email (optional)'}</label><input id="otp-sender" required={channel === 'SMS'} value={sender} onChange={event => setSender(event.target.value)} className="dev-input" /></div>
        <button className="dev-button is-primary" disabled={send.isPending}>{send.isPending ? 'Queueing code...' : 'Send verification code'}</button>
        {challenge && <button type="button" className="dev-button" disabled={send.isPending} onClick={() => { request.current = null; send.mutate(); }}>Request a new code</button>}
      </form></DeveloperCard>
      {challenge && <DeveloperCard title="Verify the received code" description={`Expires ${new Date(challenge.expiresAt).toLocaleString()}`}><form className="dev-card-body dev-stack" onSubmit={event => { event.preventDefault(); verify.mutate(); }}><div className="dev-field"><label htmlFor="otp-code">Six-digit code</label><input id="otp-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value)} className="dev-input" /></div><button className="dev-button is-primary" disabled={verify.isPending}>{verify.isPending ? 'Verifying...' : 'Verify code'}</button></form></DeveloperCard>}
      <p role="status">{feedback}</p>
      <DeveloperCard title="API example"><div className="dev-card-body"><CodeBlock title="POST - Request OTP" code={`curl --request POST '${apiUrl('/otp/request')}' --header 'X-API-Key: YOUR_API_KEY' --header 'Idempotency-Key: otp-request-001' --header 'Content-Type: application/json' --data '${sample}'`} /><p className="mt-4">POST /otp/verify with the returned challengeId and received code. A code can be used once. Requests are limited per account and recipient.</p></div></DeveloperCard>
    </div>
  </DeveloperPage>;
}
