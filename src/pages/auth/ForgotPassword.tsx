import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, KeyRound } from '../../ui/icons'
import { AuthLayout, AuthHeading, AuthField, AuthSubmit, AuthError } from '../../components/auth/AuthUI'
import { useForgotPasword } from '../../features/auth/hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [submittedEmail, setSubmittedEmail] = useState('')
    const [error, setError] = useState('')
    const { mutate, isPending } = useForgotPasword()
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isPending || !email.trim()) return
        setError('')
        const address = email.trim()
        mutate({ email: address }, {
            onSuccess: () => setSubmittedEmail(address),
            onError: requestError => setError(getApiErrorMessage(requestError, 'We could not send a reset link. Please try again.')),
        })
    }
    return <AuthLayout variant="recovery">
        {submittedEmail ? <div role="status" aria-live="polite">
            <span className="auth-confirmation-icon"><Mail size={25} /></span>
            <AuthHeading eyebrow="Check your inbox" title="Your next step is in your email" description="If the address matches an account, we’ll send a link to reset your password." />
            <div className="auth-confirmation-note"><p>We’ll use <span className="auth-confirmation-email">{submittedEmail}</span>.</p><p className="mt-3">Check your spam or junk folder if you don’t see the email. You can try again if you entered a different address.</p></div>
            <Link className="auth-primary" to="/login">Back to sign in</Link>
            <div className="auth-form-footnote"><button type="button" className="auth-text-link" onClick={() => { setSubmittedEmail(''); setError('') }}>Try again or use another email</button></div>
        </div> : <>
            <AuthHeading icon={<KeyRound size={22} />} eyebrow="Account recovery" title="Forgot your password?" description="It happens. Enter the email address you use for Pingstack and we’ll help you get back in." />
            <form onSubmit={submit} className="auth-form" aria-busy={isPending}>
                <AuthField label="Email address" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" value={email} disabled={isPending} onChange={event => { setEmail(event.target.value); setError('') }} />
                <AuthError message={error} />
                <AuthSubmit pending={isPending} pendingText="Sending reset link…">Send reset link</AuthSubmit>
            </form>
            <p className="auth-form-footnote">Remember your password? <Link to="/login" className="auth-text-link">Sign in</Link></p>
        </>}
    </AuthLayout>
}
