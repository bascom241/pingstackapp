import { DataSkeleton, InlineSkeleton } from "../../ui/Skeleton";
import MessagingHeader from '../../components/messaging/MessagingHeader'
import '../../components/messaging/email-configuration.css'
import { useEffect } from 'react'
import { AlertCircle } from '../../ui/icons'
import DomainManagement from '../../ui/modals/DomainManagement'
import { useGetEmailConfig } from '../../features/email/config/hooks/useEmailConfig'
import { useEmailConfigStore } from '../../features/email/config/store/useEmailConfigStore'
import ApiKeyModal from '../../ui/modals/ApiKeyModa'
import TrackOptions from '../../ui/modals/TrackOptions'

export default function UserEmailConfig() {
    const { data, isPending, isError, refetch } = useGetEmailConfig()
    const { setApiPrefix } = useEmailConfigStore()

    useEffect(() => {
        if (data) setApiPrefix(data.apiKeyPrefix)
    }, [data, setApiPrefix])

    return (
        <div className="messaging-page py-2 sm:py-4">
            <MessagingHeader eyebrow="Your email workspace" title="Email configuration" description="Make every email feel like you. Connect your domain, choose your insights, and manage your sending credentials." action={isPending ? <div className="email-usage"><InlineSkeleton width={150} height={15} label="Loading email usage" /><div className="mt-3"><InlineSkeleton width={120} height={28} /></div></div> : data &&
                <div className="email-usage">
                    <p className="email-usage-label">Emails sent this month</p>
                    <div className="email-usage-values"><strong>{data.emailsSentThisMonth.toLocaleString()}</strong><span>/ {data.monthlyLimit.toLocaleString()}</span></div>
                    <progress value={data.emailsSentThisMonth} max={Math.max(data.monthlyLimit, 1)} aria-label="Monthly email usage" />
                </div>
            } />
            <div className="email-settings-layout">
                <DomainManagement />
                {isPending ? <div className="email-settings-card email-section-body"><DataSkeleton layout="form" rows={3} label="Loading email preferences" /></div> : isError ? <div className="email-settings-card email-empty" role="alert"><AlertCircle size={24} /><h2>Couldn’t load email settings</h2><p>Your domains are still available. Try loading your preferences again.</p><button type="button" className="email-button" onClick={() => void refetch()}>Try again</button></div> : data && <>
                    <TrackOptions data={data} />
                    <ApiKeyModal setApiPrex={setApiPrefix} apiPrefix={data.apiKeyPrefix} />
                </>}
            </div>
        </div>
    )
}
