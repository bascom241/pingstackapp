import { DataSkeleton } from "../../ui/Skeleton";
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Building2, User, Settings, ShieldCheck, Bell, Loader2, Mail, CreditCard, Globe, KeyRound } from '../../ui/icons'
import Brand from '../../components/brand/Brand'
import { useInterfaceSettings } from '../../features/settings/store/useInterfaceSettings'
import { useGetEmailConfig } from '../../features/email/config/hooks/useEmailConfig'
import { useForgotPasword } from '../../features/auth/hooks/useAuth'
import { useLoginStore } from '../../features/auth/store/useLoginStore'
import { getAccessToken, clearAuthSession } from '../../../utils/authToken'
import { getApiErrorMessage } from '../../utils/apiError'
import TrackOptions from '../../ui/modals/TrackOptions'
import './settings.css'

const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'workspace', name: 'Workspace', icon: Building2 },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: ShieldCheck },
] as const

type Identity = { email: string; name: string; accountId: string }
function readIdentity(): Identity {
    try {
        const token = getAccessToken()
        if (!token) return { email: '', name: '', accountId: '' }
        const claims = jwtDecode<Record<string, unknown>>(token)
        const subject = typeof claims.sub === 'string' ? claims.sub : ''
        const email = typeof claims.email === 'string' ? claims.email : subject.includes('@') ? subject : ''
        return { email, name: typeof claims.name === 'string' ? claims.name : '', accountId: subject || email }
    } catch { return { email: '', name: '', accountId: '' } }
}
function SettingsCard({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
    return <section className="settings-card"><header><h2>{title}</h2><p>{description}</p></header><div className="settings-card-body">{children}</div>{footer && <footer>{footer}</footer>}</section>
}
function ResourceLink({ title, description, to, icon }: { title: string; description: string; to: string; icon: ReactNode }) {
    return <Link className="settings-resource" to={to}><span className="settings-resource-icon">{icon}</span><span><strong>{title}</strong><small>{description}</small></span><ArrowRight size={17} /></Link>
}
function ProfileSettings({ identity }: { identity: Identity }) {
    const storageKey = identity.accountId ? `pingstack:profile-draft:${encodeURIComponent(identity.accountId)}` : null
    const [saved, setSaved] = useState(() => {
        try {
            const draft = storageKey ? JSON.parse(localStorage.getItem(storageKey) || 'null') : null
            return { displayName: typeof draft?.displayName === 'string' ? draft.displayName : identity.name, jobTitle: typeof draft?.jobTitle === 'string' ? draft.jobTitle : '' }
        } catch { return { displayName: identity.name, jobTitle: '' } }
    })
    const [form, setForm] = useState(saved)
    const [feedback, setFeedback] = useState('')
    const changed = form.displayName !== saved.displayName || form.jobTitle !== saved.jobTitle
    const save = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!storageKey) { setFeedback('Your account identifier is unavailable. This draft cannot be saved.'); return }
        try { localStorage.setItem(storageKey, JSON.stringify(form)); setSaved(form); setFeedback('Profile draft saved in this browser. Your account profile has not been changed.') }
        catch { setFeedback('Browser storage is unavailable. Your changes are still on this page.') }
    }
    return <form onSubmit={save}><SettingsCard title="Personal details" description="Keep a draft of your profile information. Account profile updates are not connected yet." footer={<><p role="status">{feedback || (changed ? 'You have unsaved draft changes.' : 'Profile drafts are stored in this browser only.')}</p><div className="settings-actions"><button type="button" className="settings-button" disabled={!changed} onClick={() => { setForm(saved); setFeedback('') }}>Discard changes</button><button type="submit" className="settings-button is-primary" disabled={!changed || !storageKey}>Save draft</button></div></>}>
        <div className="settings-profile-intro"><span className="settings-avatar"><User size={27} /></span><div><h3>Your profile</h3><p>Your official account details remain unchanged.</p></div><span className="settings-tag">Browser draft</span></div>
        <div className="settings-form-grid"><div className="settings-field"><label htmlFor="settings-name">Display name</label><input id="settings-name" name="displayName" autoComplete="name" maxLength={100} placeholder="Your full name" value={form.displayName} onChange={event => { setForm(previous => ({ ...previous, displayName: event.target.value })); setFeedback('') }} /></div><div className="settings-field"><label htmlFor="settings-job-title">Job title <span>Optional</span></label><input id="settings-job-title" name="jobTitle" autoComplete="organization-title" maxLength={100} placeholder="e.g. Product manager" value={form.jobTitle} onChange={event => { setForm(previous => ({ ...previous, jobTitle: event.target.value })); setFeedback('') }} /></div></div>
        <div className="settings-field"><label htmlFor="settings-account-email">Account email</label><input id="settings-account-email" readOnly value={identity.email || 'Not available in this session'} aria-describedby="settings-email-help" /><p id="settings-email-help">Your sign-in email is shown when it is available from your session. Email changes are not available here.</p></div>
    </SettingsCard></form>
}
function WorkspaceSettings() {
    return <div className="settings-stack"><SettingsCard title="Workspace details" description="Manage the business and sending identities connected to your workspace."><div className="settings-workspace-brand"><Brand size={48} /><span className="settings-tag">Messaging workspace</span></div><div className="settings-resources"><ResourceLink title="Business verification" description="Review your business information and verification documents." to="/dashboard/kyc" icon={<Building2 size={21} />} /><ResourceLink title="Sender identities" description="Manage the names and domains your audience sees." to="/dashboard/sender-id" icon={<Globe size={21} />} /><ResourceLink title="Email configuration" description="Sending domains, tracking preferences, and email credentials." to="/dashboard/email-config" icon={<Mail size={21} />} /></div></SettingsCard><SettingsCard title="Billing & integrations" description="Keep account resources and application access in one place."><div className="settings-resources"><ResourceLink title="Billing & credits" description="View your balance, top up, and review transactions." to="/dashboard/billing" icon={<CreditCard size={21} />} /><ResourceLink title="Developer access" description="Manage email API credentials and explore integration tools." to="/dashboard/api-keys" icon={<KeyRound size={21} />} /></div><p className="settings-help mt-5">Workspace member invitations and permission management are not available here yet.</p></SettingsCard></div>
}
function InterfacePreferences() {
    const { sidebarCollapsed, reduceMotion, showBalance, update, reset } = useInterfaceSettings()
    const [feedback, setFeedback] = useState('')
    return <SettingsCard title="Interface preferences" description="Make the workspace comfortable for you. These preferences apply in this browser." footer={<><p role="status">{feedback || 'Changes apply immediately and are saved in this browser.'}</p><button type="button" className="settings-button" onClick={() => setFeedback(reset() ? 'Default preferences restored.' : 'Defaults applied for this session. Browser storage is unavailable.')}>Restore defaults</button></>}>
        {[
            { key: 'sidebarCollapsed' as const, title: 'Compact sidebar', description: 'Use an icon rail to leave more room for your main content.', checked: sidebarCollapsed },
            { key: 'reduceMotion' as const, title: 'Reduce motion', description: 'Minimize transitions and animations throughout the dashboard.', checked: reduceMotion },
            { key: 'showBalance' as const, title: 'Show wallet balance', description: 'Display your wallet balance in the dashboard header.', checked: showBalance },
        ].map(item => <div key={item.key} className="settings-preference"><div><label htmlFor={`settings-${item.key}`}>{item.title}</label><p id={`settings-${item.key}-hint`}>{item.description}</p></div><span className="settings-switch"><input id={`settings-${item.key}`} type="checkbox" role="switch" checked={item.checked} aria-describedby={`settings-${item.key}-hint`} onChange={event => { const persisted = update({ [item.key]: event.target.checked }); setFeedback(persisted ? 'Preference saved.' : 'Applied for this session. Browser storage is unavailable.') }} /><span aria-hidden="true" /></span></div>)}
    </SettingsCard>
}
function NotificationSettings() {
    const { data, isPending, isError, refetch } = useGetEmailConfig()
    return <div className="settings-stack"><div className="settings-inline-note"><Bell size={20} /><p>Manage the delivery insights available for your email configuration. Account-wide marketing and billing email preferences are not available here yet.</p></div>{isPending ? <div className="settings-card settings-card-body"><DataSkeleton layout="form" rows={3} label="Loading notification preferences" /></div> : isError || !data ? <div className="settings-card settings-loading" role="alert"><p>Couldn’t load email preferences.</p><button type="button" className="settings-button" onClick={() => void refetch()}>Try again</button></div> : <TrackOptions data={data} />}</div>
}
function SecuritySettings({ identity }: { identity: Identity }) {
    const [email, setEmail] = useState(identity.email)
    const [feedback, setFeedback] = useState('')
    const { mutate, isPending } = useForgotPasword()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const logout = useLoginStore(state => state.logout)
    const resetForm = useLoginStore(state => state.resetForm)
    const sendReset = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isPending || !email.trim()) return
        setFeedback('')
        mutate({ email: email.trim() }, { onSuccess: () => setFeedback('If this email matches an account, a password reset link will be sent.'), onError: error => setFeedback(getApiErrorMessage(error, 'Unable to send a reset link. Please try again.')) })
    }
    const signOut = () => { clearAuthSession(); logout(); resetForm(); queryClient.clear(); navigate('/login', { replace: true }) }
    return <div className="settings-stack"><form onSubmit={sendReset}><SettingsCard title="Password" description="Request a reset link to change your account password." footer={<><p role="status">{feedback || 'Use the email address associated with your account.'}</p><button type="submit" className="settings-button is-primary" disabled={isPending || !email.trim()}>{isPending && <Loader2 size={16} className="animate-spin" />}{isPending ? 'Sending…' : 'Send reset link'}</button></>}><div className="settings-field"><label htmlFor="settings-reset-email">Account email</label><input id="settings-reset-email" type="email" name="email" autoComplete="email" required value={email} disabled={isPending} placeholder="you@company.com" onChange={event => { setEmail(event.target.value); setFeedback('') }} /></div></SettingsCard></form><SettingsCard title="Sign-in session" description="Manage access from the browser you’re using now."><div className="settings-session"><div><h3>This browser</h3><p>Sign out and clear your saved authentication on this device.</p></div><button type="button" className="settings-button" onClick={signOut}>Sign out</button></div><p className="settings-help mt-5">Signing out here does not revoke sessions on other devices. Two-factor authentication and remote session management are not available here yet.</p></SettingsCard><SettingsCard title="Account management" description="Account-wide changes require connected account management."><div className="settings-session"><div><h3>Delete account</h3><p>Account deletion is not available from this application yet.</p></div><span className="settings-tag">Unavailable</span></div></SettingsCard></div>
}

export default function SettingsPage() {
    const [params, setParams] = useSearchParams()
    const [identity] = useState(readIdentity)
    const active = sections.find(section => section.id === params.get('section'))?.id || 'profile'
    const selected = sections.find(section => section.id === active)!
    return <div className="settings-page"><header className="settings-page-header"><p>Workspace / Account</p><h1>Settings</h1><span>Your profile, workspace, and preferences. All in one place.</span></header><div className="settings-layout"><nav className="settings-navigation" aria-label="Settings sections">{sections.map(({ id, name, icon: Icon }) => <button key={id} type="button" aria-current={active === id ? 'page' : undefined} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('section', id); return next })}><Icon size={19} /><span>{name}</span><ArrowRight size={14} /></button>)}<p>Changes to interface preferences stay in this browser.</p></nav><div className="settings-content" aria-label={`${selected.name} settings`} key={active}>{active === 'profile' ? <ProfileSettings identity={identity} /> : active === 'workspace' ? <WorkspaceSettings /> : active === 'preferences' ? <InterfacePreferences /> : active === 'notifications' ? <NotificationSettings /> : <SecuritySettings identity={identity} />}</div></div></div>
}
