import { useState, type FormEvent } from 'react'
import { Info, Play, ArrowRight } from '../../ui/icons'
import { DeveloperPage, DeveloperCard, DeveloperNote, DeveloperLink, CodeBlock } from '../../components/developers/DeveloperUI'

type Language = 'curl' | 'node' | 'python'
type Operation = 'send' | 'verify'
type SimulationResult = { simulated: true; operation: Operation; status: string; reference: string }

export default function OtpGuide() {
    const [language, setLanguage] = useState<Language>('curl')
    const [operation, setOperation] = useState<Operation>('send')
    const [phone, setPhone] = useState('+2348031112222')
    const [code, setCode] = useState('')
    const [hasSimulatedSend, setHasSimulatedSend] = useState(false)
    const [result, setResult] = useState<SimulationResult | null>(null)
    const [phoneError, setPhoneError] = useState('')
    const payload = operation === 'send' ? { to: phone, senderId: 'Pingstack', expiry: 300, digits: 6 } : { pinId: 'otp_example_reference', code: '123456' }
    const json = JSON.stringify(payload, null, 2)
    const exampleUrl = `https://api.example.com/v1/otp/${operation}`
    const snippets: Record<Language, string> = {
        curl: `curl --request POST '${exampleUrl}' \\
  --header "Authorization: Bearer $PINGSTACK_API_KEY" \\
  --header 'Content-Type: application/json' \\
  --data '${json.replaceAll("'", "'\"'\"'")}'`,
        node: `const response = await fetch('${exampleUrl}', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.PINGSTACK_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${json}),
});

if (!response.ok) {
  throw new Error(\`Request failed: \${response.status}\`);
}
console.log(await response.json());`,
        python: `import os
import requests

payload = ${json}
response = requests.post(
    '${exampleUrl}',
    headers={
        'Authorization': f"Bearer {os.environ['PINGSTACK_API_KEY']}"
    },
    json=payload,
    timeout=30,
)
response.raise_for_status()
print(response.json())`,
    }
    const simulateSend = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!/^\+[1-9]\d{7,14}$/.test(phone)) { setPhoneError('Use international format, for example +2348031112222.'); return }
        setHasSimulatedSend(true)
        setCode('')
        setResult({ simulated: true, operation: 'send', status: 'awaiting_verification', reference: 'otp_demo_local' })
    }
    const simulateVerify = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setResult({ simulated: true, operation: 'verify', status: code === '123456' ? 'verified' : 'invalid_code', reference: 'otp_demo_local' })
    }

    return <DeveloperPage title="OTP integration guide" description="Understand the send-and-verify flow, explore request examples, and try the interaction locally." action={<span className="dev-badge">Integration guide</span>}>
        <div className="dev-layout">
            <div className="dev-stack">
                <DeveloperCard id="otp-overview" title="How verification works" description="Keep code creation and verification on your server.">
                    <div className="dev-card-body dev-steps">{[
                        { title: 'Request a code', text: 'Your server requests an OTP for a phone number and stores the returned reference.' },
                        { title: 'Collect the code', text: 'Your application asks the recipient to enter the code they received.' },
                        { title: 'Verify the result', text: 'Your server submits the code and reference, then handles the verification result.' },
                    ].map((step, index) => <div key={step.title}><span className="dev-step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
                </DeveloperCard>
                <DeveloperCard id="otp-examples" title="Request examples" description="Illustrative requests for your server-side integration." action={<span className="dev-badge">Example schema</span>}>
                    <div className="dev-card-body">
                        <div className="dev-inline-note mb-6"><Info size={18} /><p>Replace the example host and confirm routes, fields, and authentication in your API reference. These examples do not make live requests.</p></div>
                        <div className="dev-segments" aria-label="Example operation">{(['send', 'verify'] as const).map(value => <button type="button" key={value} aria-pressed={operation === value} onClick={() => setOperation(value)}>{value === 'send' ? 'Send OTP' : 'Verify OTP'}</button>)}</div>
                        <div className="dev-endpoint"><span className="dev-method">POST</span><code>/v1/otp/{operation}</code></div>
                        <div className="dev-segments" aria-label="Code language">{(['curl', 'node', 'python'] as const).map(value => <button type="button" key={value} aria-pressed={language === value} onClick={() => setLanguage(value)}>{value === 'curl' ? 'cURL' : value === 'node' ? 'Node.js' : 'Python'}</button>)}</div>
                        <CodeBlock code={snippets[language]} title={`${language === 'node' ? 'JavaScript' : language === 'python' ? 'Python' : 'Shell'} · ${operation === 'send' ? 'Send' : 'Verify'} example`} />
                    </div>
                </DeveloperCard>
                <DeveloperCard id="otp-reference" title="Example field reference" description="Fields used by the illustrative send-and-verify examples above.">
                    <div className="dev-table-scroll"><table className="dev-table"><thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Purpose</th></tr></thead><tbody>{[
                        { field: 'to', type: 'string', description: 'Recipient phone number in international format.' },
                        { field: 'senderId', type: 'string', description: 'Sender identity used for the message.' },
                        { field: 'expiry', type: 'integer', description: 'Example code lifetime in seconds: 300.' },
                        { field: 'digits', type: 'integer', description: 'Example code length: 6 digits.' },
                        { field: 'pinId', type: 'string', description: 'Reference returned by the send request, used when verifying.' },
                        { field: 'code', type: 'string', description: 'Code entered by the recipient. Preserve leading zeros.' },
                    ].map(row => <tr key={row.field}><td><code>{row.field}</code></td><td><span className="dev-badge">{row.type}</span></td><td>{row.description}</td></tr>)}</tbody></table></div>
                </DeveloperCard>
                <DeveloperCard id="otp-simulation" title="Try the verification flow" description="A local simulation. No SMS is sent and no credits are used." action={<span className="dev-badge">Simulation</span>}>
                    <div className="dev-card-body">
                        <form onSubmit={simulateSend}><div className="dev-field"><label htmlFor="otp-test-phone">Test phone number</label><div className="dev-input-row"><input id="otp-test-phone" type="tel" autoComplete="tel" required value={phone} onChange={event => { setPhone(event.target.value); setPhoneError(''); setResult(null); setHasSimulatedSend(false); setCode('') }} className="dev-input dev-mono" aria-invalid={Boolean(phoneError)} aria-describedby="otp-phone-help" /><button type="submit" className="dev-button is-primary"><Play size={16} />Simulate send</button></div><p id="otp-phone-help" className="dev-helper">{phoneError || 'Use international format without spaces, for example +2348031112222.'}</p></div></form>
                        {hasSimulatedSend && <form onSubmit={simulateVerify} className="mt-6"><div className="dev-field"><label htmlFor="otp-test-code">Verification code</label><div className="dev-input-row"><input id="otp-test-code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value)} className="dev-input dev-mono" placeholder="Enter 6 digits" aria-describedby="otp-code-help" /><button type="submit" className="dev-button">Verify code<ArrowRight size={16} /></button></div><p id="otp-code-help" className="dev-helper">Use demo code <code>123456</code> to simulate a successful verification. Any other six digits will simulate an invalid code.</p></div></form>}
                        {result && <div className="dev-response"><p className="dev-helper mb-3" role="status">{result.operation === 'send' ? 'Simulated send complete. Enter the demo code below to verify.' : result.status === 'verified' ? 'Demo code accepted. Simulation complete.' : 'Demo code did not match. Try 123456.'}</p><CodeBlock code={JSON.stringify(result, null, 2)} title="Simulated response" /></div>}
                    </div>
                </DeveloperCard>
            </div>
            <aside className="dev-sidebar">
                <DeveloperNote title="On this page"><nav className="dev-anchor-list" aria-label="OTP guide contents"><a href="#otp-overview">Verification flow</a><a href="#otp-examples">Request examples</a><a href="#otp-reference">Example field reference</a><a href="#otp-simulation">Local simulation</a></nav></DeveloperNote>
                <DeveloperNote title="Before you integrate"><p>Keep API credentials on your server. The credentials screen currently manages email API keys; confirm the appropriate authentication for your OTP integration.</p><DeveloperLink to="/dashboard/api-keys">API keys & sandbox</DeveloperLink></DeveloperNote>
                <DeveloperNote title="Handle every outcome"><ul><li>Show clear feedback for an invalid or expired code.</li><li>Offer a way to correct the recipient’s number.</li><li>Control resend frequency and verification attempts on your server.</li><li>Never treat a local simulation as a verified user.</li></ul></DeveloperNote>
            </aside>
        </div>
    </DeveloperPage>
}
