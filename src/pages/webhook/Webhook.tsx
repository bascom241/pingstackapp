import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../api/axios';
import { getApiErrorMessage } from '../../utils/apiError';
import { DeveloperPage, DeveloperCard, CodeBlock } from '../../components/developers/DeveloperUI';

type Endpoint = { id: string; url: string; events: string[]; enabled: boolean };
type Delivery = { id: string; event: string; status: string; attempts: number; responseStatus?: number; updatedAt: string };
const eventOptions = ['sms.sent', 'sms.delivered', 'sms.failed', 'email.sent', 'email.delivered', 'email.failed', 'email.bounced', 'email.unknown'];
export default function WebhooksConfig() {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState(['sms.delivered', 'sms.failed']);
  const [feedback, setFeedback] = useState('');
  const [secret, setSecret] = useState('');
  const cache = useQueryClient();
  const endpoints = useQuery({ queryKey: ['webhook-endpoints'], queryFn: async () => (await axiosInstance.get<Endpoint[]>('/webhook-endpoints')).data });
  const deliveries = useQuery({ queryKey: ['webhook-deliveries'], queryFn: async () => (await axiosInstance.get<{ content: Delivery[] }>('/webhook-endpoints/deliveries')).data, refetchInterval: 10000 });
  const create = useMutation({
    mutationFn: async () => (await axiosInstance.post<{ signingSecret: string }>('/webhook-endpoints', { url, events })).data,
    onSuccess: data => { setSecret(data.signingSecret); setFeedback('Endpoint registered. Copy the signing secret now; it is shown only once.'); setUrl(''); cache.invalidateQueries({ queryKey: ['webhook-endpoints'] }); },
    onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const remove = useMutation({ mutationFn: (id: string) => axiosInstance.delete(`/webhook-endpoints/${id}`), onSuccess: () => cache.invalidateQueries({ queryKey: ['webhook-endpoints'] }), onError: error => setFeedback(getApiErrorMessage(error)) });
  const submit = (event: FormEvent) => { event.preventDefault(); setSecret(''); create.mutate(); };
  return <DeveloperPage title="Webhooks" description="Receive signed delivery notifications from your messaging workspace.">
    <div className="dev-stack">
      <form onSubmit={submit}><DeveloperCard title="Register an endpoint" description="Use a public HTTPS endpoint on a host approved in your server configuration.">
        <div className="dev-card-body dev-stack"><div className="dev-field"><label htmlFor="webhook-url">Endpoint URL</label><input id="webhook-url" type="url" required value={url} onChange={event => setUrl(event.target.value)} className="dev-input" placeholder="https://yourcompany.com/webhooks/pingstack" /></div>
        <fieldset><legend>Events</legend>{eventOptions.map(topic => <label className="dev-event-row" key={topic}><input type="checkbox" checked={events.includes(topic)} onChange={event => setEvents(current => event.target.checked ? [...current, topic] : current.filter(value => value !== topic))} /><span>{topic}</span></label>)}</fieldset>
        <button className="dev-button is-primary" disabled={create.isPending || !events.length}>{create.isPending ? 'Registering?' : 'Register endpoint'}</button><p role="status">{feedback}</p>
        {secret && <CodeBlock title="Signing secret ? copy now" code={secret} />}</div>
      </DeveloperCard></form>
      <DeveloperCard title="Registered endpoints"><div className="dev-card-body dev-stack">{endpoints.isPending && <p>Loading endpoints?</p>}{endpoints.isError && <p role="alert">{getApiErrorMessage(endpoints.error)}</p>}{endpoints.data?.length === 0 && <p>No endpoints registered.</p>}{endpoints.data?.map(endpoint => <div key={endpoint.id} className="flex flex-wrap justify-between gap-4 border-b py-3"><div><strong className="break-all">{endpoint.url}</strong><p>{endpoint.events.join(', ')}</p></div><button className="dev-button" disabled={remove.isPending} onClick={() => remove.mutate(endpoint.id)}>Remove</button></div>)}</div></DeveloperCard>
      <DeveloperCard title="Recent deliveries"><div className="dev-card-body overflow-x-auto">{deliveries.isError && <p role="alert">{getApiErrorMessage(deliveries.error)}</p>}{deliveries.data?.content.length === 0 && <p>No deliveries yet.</p>}<table className="w-full text-left text-sm"><thead><tr><th className="p-2">Event</th><th className="p-2">Status</th><th className="p-2">Attempts</th><th className="p-2">HTTP</th></tr></thead><tbody>{deliveries.data?.content.map(delivery => <tr key={delivery.id}><td className="p-2">{delivery.event}</td><td className="p-2">{delivery.status}</td><td className="p-2">{delivery.attempts}</td><td className="p-2">{delivery.responseStatus ?? '?'}</td></tr>)}</tbody></table></div></DeveloperCard>
      <DeveloperCard title="Verify incoming events"><div className="dev-card-body"><p>Verify X-Pingstack-Signature against the HMAC-SHA256 of the timestamp, a period, and the exact raw request body. The signature starts with v1=. Reject stale timestamps and deduplicate using the event ID. Delivery is retried up to five times.</p></div></DeveloperCard>
    </div>
  </DeveloperPage>;
}
