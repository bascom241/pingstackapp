import { useEffect, useState } from 'react'
import { Eye, Link, AlertCircle, LineChart, Loader2 } from '../icons'
import { EmailSectionHeading, StatusMark } from '../../components/messaging/EmailConfigElements'
import type { EmailConfigResponse } from '../../types/email/EmailConfigDto'
import { useUpdatePreference, EMAIL_CONFIG_QUERY } from '../../features/email/config/hooks/useEmailConfig'
import { useSnackbar } from 'notistack'
import { getApiErrorMessage } from '../../utils/apiError'
import { useQueryClient } from '@tanstack/react-query'

const trackingOptions = [
    { key: 'trackOpens', title: 'Email opens', description: 'See when recipients open your emails to understand what gets their attention.', icon: Eye },
    { key: 'trackClicks', title: 'Link clicks', description: 'Measure engagement by tracking clicks on links inside your emails.', icon: Link },
    { key: 'bounceAlerts', title: 'Bounce alerts', description: 'Get notified when an email cannot be delivered so you can keep your lists up to date.', icon: AlertCircle },
] as const

export default function TrackOptions({ data }: { data: EmailConfigResponse }) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const { mutate, isPending } = useUpdatePreference()
    const { trackOpens, trackClicks, bounceAlerts } = data
    const [settings, setSettings] = useState({ trackOpens, trackClicks, bounceAlerts })
    const [saved, setSaved] = useState({ trackOpens, trackClicks, bounceAlerts })
    const hasChanges = trackingOptions.some(({ key }) => settings[key] !== saved[key])

    useEffect(() => {
        const next = { trackOpens, trackClicks, bounceAlerts }
        setSettings(next)
        setSaved(next)
    }, [trackOpens, trackClicks, bounceAlerts])

    const savePreferences = () => {
        if (isPending || !hasChanges) return
        const submitted = { ...settings }
        mutate(submitted, {
            onSuccess: () => {
                setSaved(submitted)
                void queryClient.invalidateQueries({ queryKey: EMAIL_CONFIG_QUERY })
                enqueueSnackbar('Tracking preferences saved.', { variant: 'success' })
            },
            onError: (error) => enqueueSnackbar(getApiErrorMessage(error, 'Unable to save tracking preferences. Please try again.'), { variant: 'error' }),
        })
    }

    return (
        <section className="email-settings-card" aria-label="Tracking and analytics" aria-busy={isPending}>
            <EmailSectionHeading icon={<LineChart size={23} />} title="Tracking & analytics" description="Choose the insights you collect from your emails. You’re in control of what gets tracked." />
            <div className="email-tracking-list">
                {trackingOptions.map(({ key, title, description, icon: Icon }) => (
                    <div key={key} className="email-tracking-row">
                        <span className="email-tracking-icon"><Icon size={22} /></span>
                        <div className="email-tracking-copy"><label htmlFor={`tracking-${key}`}>{title}</label><p id={`tracking-${key}-description`}>{description}</p></div>
                        <span className="email-switch">
                            <input id={`tracking-${key}`} type="checkbox" role="switch" checked={settings[key]} disabled={isPending} aria-describedby={`tracking-${key}-description`} onChange={(event) => setSettings(previous => ({ ...previous, [key]: event.target.checked }))} />
                            <span className="email-switch-track" aria-hidden="true" />
                        </span>
                    </div>
                ))}
            </div>
            <div className="email-settings-footer">
                <p role="status" aria-live="polite">{isPending ? 'Saving your preferences…' : hasChanges ? 'You have unsaved changes.' : <><StatusMark /> Your preferences are up to date.</>}</p>
                <button type="button" className="email-button is-primary" disabled={!hasChanges || isPending} onClick={savePreferences}>{isPending && <Loader2 size={17} className="animate-spin" />}{isPending ? 'Saving…' : 'Save preferences'}</button>
            </div>
        </section>
    )
}
