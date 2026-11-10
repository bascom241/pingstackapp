import { ShieldCheck } from "../../ui/icons";
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout, AuthHeading, AuthField, AuthPassword, AuthSubmit, AuthError } from '../../components/auth/AuthUI'
import { useLogin } from '../../features/auth/hooks/useAuth'
import { useLoginStore } from '../../features/auth/store/useLoginStore'
import { saveAuthSession } from '../../../utils/authToken'
import { getApiErrorMessage } from '../../utils/apiError'
import { safeAuthRedirect } from '../../features/auth/utils'

export default function Login() {
    const { mutate, isPending } = useLogin()
    const { formData, setFormData, setToken, resetForm } = useLoginStore()
    const [error, setError] = useState('')
    const [params] = useSearchParams()
    const navigate = useNavigate()
    useEffect(() => () => resetForm(), [resetForm])
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isPending) return
        setError('')
        mutate({ email: formData.email.trim(), password: formData.password }, {
            onSuccess: data => {
                if (!data?.accessToken) { setError('We could not complete sign-in. Please try again.'); return }
                saveAuthSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: data.roles?.[0] })
                setToken(data.accessToken)
                resetForm()
                navigate(safeAuthRedirect(params.get('redirect')), { replace: true })
            },
            onError: requestError => setError(getApiErrorMessage(requestError, 'We could not sign you in. Check your details and try again.')),
        })
    }
    return <AuthLayout>
        <AuthHeading icon={<ShieldCheck size={22} />} eyebrow="Welcome back" title="Sign in to your workspace" description="Your messages, contacts, and campaigns are right where you left them." />
        <form className="auth-form" onSubmit={handleSubmit} aria-busy={isPending}>
            <AuthField label="Email address" type="email" name="email" autoComplete="username" required maxLength={254} placeholder="you@company.com" value={formData.email} disabled={isPending} onChange={event => { setFormData({ email: event.target.value }); setError('') }} />
            <AuthPassword label="Password" name="password" autoComplete="current-password" required placeholder="Enter your password" value={formData.password} disabled={isPending} onChange={event => { setFormData({ password: event.target.value }); setError('') }} />
            <div className="auth-password-link"><Link to="/forgot-password" className="auth-text-link">Forgot your password?</Link></div>
            {params.get("logout") === "local-only" && <p role="status">Signed out on this device. Server confirmation was unavailable.</p>}
            <AuthError message={error} />
            <AuthSubmit pending={isPending} pendingText="Signing in…">Sign in</AuthSubmit>
        </form>
        <p className="auth-form-footnote">New here? <Link className="auth-text-link" to={params.get('redirect') ? `/register?redirect=${encodeURIComponent(safeAuthRedirect(params.get('redirect')))}` : '/register'}>Create your Pingstack account</Link></p>
    </AuthLayout>
}
