import { useState, type FormEvent } from 'react'
import { Info, Save, Radio } from '../../ui/icons'
import { DeveloperPage, DeveloperCard, DeveloperNote, DeveloperLink, CodeBlock } from '../../components/developers/DeveloperUI'

const eventOptions = [
    { key: 'sms.delivered', label: 'SMS delivered', description: 'A delivery notification for an SMS message.' },
    { key: 'sms.failed', label: 'SMS failed', description: 'A notification that an SMS could not be delivered.' },
    { key: 'otp.verified', label: 'OTP verified', description: 'A notification that a verification code was accepted.' },
    { key: 'email.bounced', label: 'Email bounced', description: 'A notification that an email was rejected by the receiving server.' },
] as const
type EventName = typeof eventOptions[number]['key']
const STORAGE_KEY = 'pingstack:webhook-draft:v1'
const initialEvents: EventName[] = ['sms.delivered', 'sms.failed']
function readDraft(): { url: string; events: EventName[] } {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (stored && typeof stored.url === 'string' && Array.isArray(stored.events)) return { url: stored.url, events: stored.events.filter((key: unknown): key is EventName => eventOptions.some(option => option.key === key)) }
    } catch { /* Use an empty draft when browser storage is unavailable. */ }
    return { url: '', events: initialEvents }
}

export default function WebhooksConfig() {
    const [initialDraft] = useState(readDraft)
    const [webhookUrl, setWebhookUrl] = useState(initialDraft.url)
    const [events, setEvents] = useState<EventName[]>(initialDraft.events)
    const [feedback, setFeedback] = useState('')
    const [previewEvent, setPreviewEvent] = useState<EventName>('sms.delivered')
    const [saved, setSaved] = useState(initialDraft)
    const hasChanges = webhookUrl.trim() !== saved.url || JSON.stringify(events) !== JSON.stringify(saved.events)
    const examplePayload = JSON.stringify({ id: 'evt_example_001', type: previewEvent, createdAt: '2026-01-01T12:00:00Z', data: { messageId: 'msg_example_001', ...(previewEvent === 'email.bounced' ? { recipient: 'recipient@example.com' } : { recipient: '+2348031112222' }), status: previewEvent.split('.')[1] } }, null, 2)
    const saveDraft = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!events.length) { setFeedback('Select at least one event for your draft.'); return }
        const next = { url: webhookUrl.trim(), events }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            setSaved(next)
            setFeedback('Draft saved in this browser. Your endpoint has not been registered and will not receive events.')
        } catch { setFeedback('Could not save this draft in your browser. Your changes are still available on this page.') }
    }

    return <DeveloperPage title="Webhooks" description="Prepare an endpoint for delivery updates and choose the events your application needs." action={<span className="dev-badge">Local draft</span>}>
        <div className="dev-layout">
            <div className="dev-stack">
                <div className="dev-inline-note"><Info size={18} /><p>Webhook registration is not connected yet. You can prepare and save a draft here; no events will be sent to your endpoint.</p></div>
                <form onSubmit={saveDraft} className="dev-stack">
                    <DeveloperCard title="Endpoint details" description="Choose where your application will receive event notifications.">
                        <div className="dev-card-body">
                            <div className="dev-field"><label htmlFor="webhook-url">Endpoint URL</label><input id="webhook-url" name="endpoint" type="url" required pattern="https://.*" value={webhookUrl} onChange={event => { setWebhookUrl(event.target.value); setFeedback('') }} placeholder="https://yourcompany.com/webhooks/pingstack" className="dev-input" aria-describedby="webhook-url-help" /><p id="webhook-url-help" className="dev-helper">Use a public HTTPS endpoint that your server controls.</p></div>
                            <div className="dev-field"><span className="dev-field-label">Signing secret</span><div className="dev-input !text-sm" aria-label="Signing secret unavailable">Not available for local drafts</div><p className="dev-helper">A real signing secret is needed to authenticate incoming events. None has been issued for this draft.</p></div>
                        </div>
                    </DeveloperCard>
                    <DeveloperCard title="Event subscriptions" description="These example topics help you plan your integration. Confirm available events in your API reference." action={<span className="dev-badge">{events.length} selected</span>}>
                        <fieldset className="dev-event-list"><legend className="sr-only">Select event topics</legend>{eventOptions.map(option => <label className="dev-event-row" key={option.key}><input type="checkbox" checked={events.includes(option.key)} onChange={event => { setEvents(previous => event.target.checked ? [...previous, option.key] : previous.filter(key => key !== option.key)); setFeedback('') }} /><span><strong className="dev-mono">{option.key}</strong><small>{option.description}</small></span></label>)}</fieldset>
                        <div className="dev-card-footer"><p role="status">{feedback || (hasChanges ? 'You have unsaved draft changes.' : 'Changes are saved only when you save this draft.')}</p><button type="submit" className="dev-button is-primary" disabled={!hasChanges || !webhookUrl.trim() || !events.length}><Save size={16} />Save draft</button></div>
                    </DeveloperCard>
                </form>
                <DeveloperCard title="Event payload" description="An illustrative event shape to help you plan your receiver. This is not a live delivery.">
                    <div className="dev-card-body"><div className="dev-field mb-5"><label htmlFor="webhook-preview-event">Preview event</label><select id="webhook-preview-event" value={previewEvent} onChange={event => setPreviewEvent(event.target.value as EventName)} className="dev-input">{eventOptions.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}</select></div><CodeBlock title="JSON · Example payload" code={examplePayload} /></div>
                </DeveloperCard>
                <DeveloperCard title="Delivery activity" action={<span className="dev-badge">Not connected</span>}><div className="dev-empty"><Radio size={25} /><h3>No live deliveries</h3><p>Your draft is not registered as an active endpoint. Delivery history will be available when webhook delivery is connected.</p></div></DeveloperCard>
            </div>
            <aside className="dev-sidebar">
                <DeveloperNote title="Receiver checklist"><ul><li>Accept HTTPS requests on your endpoint.</li><li>Validate the signature using the documented signing format.</li><li>Handle repeated events safely.</li><li>Keep event processing separate from your response.</li></ul></DeveloperNote>
                <DeveloperNote title="Draft storage"><p>The endpoint URL and selected topics are stored in this browser when you save. No signing secret or credentials are stored with this draft.</p></DeveloperNote>
                <DeveloperNote title="Related tools"><DeveloperLink to="/dashboard/api-keys">API keys & sandbox</DeveloperLink><br /><DeveloperLink to="/dashboard/otp-guide">OTP integration guide</DeveloperLink></DeveloperNote>
            </aside>
        </div>
    </DeveloperPage>
}
