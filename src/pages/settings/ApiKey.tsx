import { DataSkeleton } from "../../ui/Skeleton";
import { useState } from 'react'
import { Activity, Check, Code2, Info } from '../../ui/icons'
import { DeveloperPage, DeveloperCard, DeveloperNote, DeveloperLink, CodeBlock } from '../../components/developers/DeveloperUI'
import { useGetEmailConfig } from '../../features/email/config/hooks/useEmailConfig'
import { useEmailConfigStore } from '../../features/email/config/store/useEmailConfigStore'
import ApiKeyModal from '../../ui/modals/ApiKeyModa'
import { apiUrl } from '../../api/config'

const initialPayload = JSON.stringify({ to: '+2348031112222', senderId: 'Pingstack', message: 'Hello from Pingstack.' }, null, 2)

export default function ApiKeysPlayground() {
    const { data, isPending, isError, refetch } = useGetEmailConfig()
    const { setApiPrefix } = useEmailConfigStore()
    const [payload, setPayload] = useState(initialPayload)
    const [validation, setValidation] = useState<{ valid: boolean; message: string } | null>(null)
    const requestCode = `curl --request POST '${apiUrl("/v1/sms/send")}' \\
  --header "Authorization: Bearer $PINGSTACK_API_KEY" \\
  --header 'Content-Type: application/json' \\
  --data '${payload.replaceAll("'", "'\"'\"'")}'`

    const validate = () => {
        try {
            const parsed: unknown = JSON.parse(payload)
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Use a JSON object as the request body.')
            setValidation({ valid: true, message: 'Valid JSON object. This checks syntax only; no request was sent.' })
        } catch (error) { setValidation({ valid: false, message: error instanceof SyntaxError ? 'This JSON is not valid. Check quotation marks, commas, and brackets.' : error instanceof Error ? error.message : 'Unable to validate this request body.' }) }
    }

    return <DeveloperPage title="API keys & sandbox" description="Manage your email API credentials and prepare requests before adding them to your application." action={<span className="dev-badge">Developer workspace</span>}>
        <div className="dev-layout">
            <div className="dev-stack">
                {isPending ? <DeveloperCard title="API credentials"><div className="dev-card-body"><DataSkeleton layout="form" rows={1} label="Loading API credentials" /></div></DeveloperCard> : isError || !data ? <DeveloperCard title="API credentials"><div className="dev-empty" role="alert"><h3>Couldn’t load credentials</h3><p>Try again to view your email API key prefix.</p><button type="button" className="dev-button" onClick={() => void refetch()}>Try again</button></div></DeveloperCard> : <div className="dev-credentials"><ApiKeyModal apiPrefix={data.apiKeyPrefix} setApiPrex={setApiPrefix} /></div>}
                <DeveloperCard id="request-builder" title="Request builder" description="Edit a sample request body and check its JSON syntax." action={<span className="dev-badge">Local sandbox</span>}>
                    <div className="dev-card-body">
                        <div className="dev-inline-note"><Info size={18} /><p>This illustrative SMS request uses your configured API host. Confirm the route and fields against your API reference before using it.</p></div>
                        <div className="dev-field mt-6"><label htmlFor="sandbox-request-body">Request body</label><textarea id="sandbox-request-body" value={payload} onChange={event => { setPayload(event.target.value); setValidation(null) }} spellCheck={false} className="dev-input dev-mono min-h-52 !text-sm !leading-7" aria-describedby="request-body-help" /><p id="request-body-help" className="dev-helper">Use a JSON object. This sandbox does not send messages or consume credits.</p></div>
                        {validation && <div className="dev-inline-note mt-5" role="status">{validation.valid ? <Check size={18} /> : <Info size={18} />}<p>{validation.message}</p></div>}
                    </div>
                    <div className="dev-card-footer"><p>Local validation · No network request</p><button type="button" className="dev-button is-primary" onClick={validate}><Code2 size={17} />Validate JSON</button></div>
                </DeveloperCard>
                <DeveloperCard title="Request example" description="Use an environment variable for your key when adapting this example.">
                    <div className="dev-card-body"><CodeBlock title="cURL · Illustrative example" code={requestCode} /></div>
                </DeveloperCard>
                <DeveloperCard title="Request activity" description="Request logs will appear here when activity reporting is connected.">
                    <div className="dev-table-scroll"><table className="dev-table"><thead><tr><th scope="col">Request</th><th scope="col">Status</th><th scope="col">Duration</th><th scope="col">Time</th></tr></thead></table></div>
                    <div className="dev-empty"><Activity size={25} /><h3>No connected request activity</h3><p>Sandbox validation runs locally. It does not create API request logs.</p></div>
                </DeveloperCard>
            </div>
            <aside className="dev-sidebar">
                <DeveloperNote title="Credential scope"><p>The credentials on this page belong to your email configuration. Only the key prefix can be retrieved after generation.</p><DeveloperLink to="/dashboard/email-config">Email configuration</DeveloperLink></DeveloperNote>
                <DeveloperNote title="Integration checklist"><ul><li>Store credentials in your server environment.</li><li>Use your configured API host and documented routes.</li><li>Handle error responses before retrying.</li><li>Rotate credentials when access changes.</li></ul></DeveloperNote>
                <DeveloperNote title="Continue building"><p>Prepare an event receiver or explore the OTP integration flow.</p><DeveloperLink to="/dashboard/webhooks">Configure webhooks</DeveloperLink><br /><DeveloperLink to="/dashboard/otp-guide">Read the OTP guide</DeveloperLink></DeveloperNote>
            </aside>
        </div>
    </DeveloperPage>
}
