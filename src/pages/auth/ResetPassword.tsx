import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, KeyRound } from '../../ui/icons'
import { AuthLayout, AuthHeading, AuthField, AuthPassword, AuthSubmit, AuthError } from '../../components/auth/AuthUI'
import { useResetPassword } from '../../features/auth/hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'

export default function ResetPassword() {
    const [params] = useSearchParams()
    const linkToken = params.get('token') || ''
    const [token, setToken] = useState(linkToken)
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const [complete, setComplete] = useState(false)
    const { mutate, isPending } = useResetPassword()
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isPending) return
        setError('')
        if (!token.trim()) { setError('Enter the reset token from your email, or request a new reset link.'); return }
        if (password.length < 8) { setError('Choose a password with at least 8 characters.'); return }
        if (password !== confirmation) { setError('Your passwords do not match. Please check them and try again.'); return }
        mutate({ token: token.trim(), newPassword: password }, {
            onSuccess: () => { setPassword(''); setConfirmation(''); setToken(''); setComplete(true) },
            onError: requestError => setError(getApiErrorMessage(requestError, 'We could not reset your password. Your link may have expired. Request a new link and try again.')),
        })
    }
    return <AuthLayout variant="recovery">
        {complete ? <div role="status" aria-live="polite"><span className="auth-confirmation-icon"><Check size={25} /></span><AuthHeading eyebrow="You’re all set" title="Password updated" description="Your new password is ready. Sign in to get back to your workspace." /><Link className="auth-primary" to="/login">Sign in to Pingstack</Link></div> : <>
            <AuthHeading icon={<KeyRound size={22} />} eyebrow="A fresh start" title="Choose a new password" description="Set a new password for your Pingstack account, then sign in to continue." />
            <form className="auth-form" onSubmit={submit} aria-busy={isPending}>
                {!linkToken && <AuthField label="Reset token" name="token" autoComplete="off" autoCapitalize="none" spellCheck={false} required value={token} disabled={isPending} placeholder="Paste the token from your email" hint="If your email includes a reset link, opening it will fill this in for you." onChange={event => { setToken(event.target.value); setError('') }} />}
                <AuthPassword label="New password" name="newPassword" autoComplete="new-password" minLength={8} required disabled={isPending} value={password} placeholder="Create a new password" hint="Use at least 8 characters. Choose a password you don’t use elsewhere." onChange={event => { setPassword(event.target.value); setError('') }} />
                <AuthPassword label="Confirm new password" name="confirmPassword" autoComplete="new-password" required disabled={isPending} value={confirmation} placeholder="Enter your new password again" aria-invalid={Boolean(confirmation && confirmation !== password)} onChange={event => { setConfirmation(event.target.value); setError('') }} />
                <AuthError message={error} />
                <AuthSubmit pending={isPending} pendingText="Updating password…">Update password</AuthSubmit>
            </form>
            <p className="auth-form-footnote">Need another link? <Link className="auth-text-link" to="/forgot-password">Request a password reset</Link></p>
        </>}
    </AuthLayout>
}
