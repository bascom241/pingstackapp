import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, User, Building2, KeyRound } from '../../ui/icons'
import { AuthLayout, AuthHeading, AuthField, AuthPassword, AuthSelect, AuthSubmit, AuthError } from '../../components/auth/AuthUI'
import { useRegisterStore } from '../../features/auth/store/useRegisterStore'
import { useRegister } from '../../features/auth/hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'
import { normalizeRegistrationPhone, registrationPayload, safeAuthRedirect } from '../../features/auth/utils'
import { useSnackbar } from 'notistack'

const steps = [
    { name: 'Your details', icon: User, title: 'Let’s start with you', description: 'Tell us who you are and how we can reach you.' },
    { name: 'Workspace', icon: Building2, title: 'A home for your business', description: 'A few details to help us set up your messaging workspace.' },
    { name: 'Password', icon: KeyRound, title: 'Make it yours', description: 'Choose a password and check your details before creating your account.' },
]
const sectors = [['Financial_Services', 'Financial services'], ['Online_Retail_Services', 'Online retail'], ['Educational_Services', 'Education'], ['Advertising_And_Marketing_Services', 'Advertising & marketing']]
const roles = [['Engineering_Lead_OR_CTO', 'Engineering lead / CTO'], ['ProductManager', 'Product manager'], ['OPERATION_AND_DEVOPS', 'Operations & DevOps'], ['FOUNDER_OR_EXECUTIVE', 'Founder / executive']]

export default function Register() {
    const { formData, setFormData, resetForm } = useRegisterStore()
    const { mutate, isPending } = useRegister()
    const { enqueueSnackbar } = useSnackbar()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const reduceMotion = useReducedMotion()
    const heading = useRef<HTMLDivElement>(null)
    useEffect(() => () => setFormData({ password: '' }), [setFormData])
    const goToStep = (next: number) => { setError(''); setStep(next) }
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isPending) return
        setError('')
        if (step === 0) {
            if (!formData.firstName.trim() || !formData.lastName.trim()) { setError('Enter your first and last name.'); return }
            if (!/^\+[1-9]\d{7,14}$/.test(normalizeRegistrationPhone(formData.countryCode, formData.phoneNumber))) { setError('Enter a valid phone number for your selected country.'); return }
            goToStep(1)
        } else if (step === 1) {
            if (!formData.companyName.trim()) { setError('Enter your registered business or workspace name.'); return }
            goToStep(2)
        } else {
            if (formData.password.length < 8) { setError('Choose a password with at least 8 characters.'); return }
            if (formData.password !== confirmation) { setError('Your passwords do not match. Please check them and try again.'); return }
            if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !/^\+[1-9]\d{7,14}$/.test(normalizeRegistrationPhone(formData.countryCode, formData.phoneNumber))) { goToStep(0); return }
            if (!formData.companyName.trim() || !formData.sector || !formData.creatorRole || !formData.source) { goToStep(1); return }
            mutate(registrationPayload(formData), {
                onSuccess: data => {
                    resetForm()
                    setConfirmation('')
                    enqueueSnackbar(data?.message || 'Account created. Sign in to continue.', { variant: 'success' })
                    const redirect = params.get('redirect')
                    navigate(redirect ? `/login?redirect=${encodeURIComponent(safeAuthRedirect(redirect))}` : '/login', { replace: true })
                },
                onError: requestError => setError(getApiErrorMessage(requestError, 'We could not create your account. Please try again.')),
            })
        }
    }
    return <AuthLayout variant="register">
        <ol className="auth-step-progress" aria-label="Registration progress">{steps.map((item, index) => <li key={item.name} className={step > index ? 'is-complete' : ''} aria-current={step === index ? 'step' : undefined}><span className="auth-step-icon" aria-hidden="true">{step > index ? <Check size={15} /> : <item.icon size={15} />}</span><span>{index + 1}. {item.name}</span></li>)}</ol>
        <div ref={heading} tabIndex={-1} className="auth-step-heading"><AuthHeading eyebrow={`Create your account · Step ${step + 1} of 3`} title={steps[step].title} description={steps[step].description} /></div>
        <form className="auth-form" onSubmit={handleSubmit} aria-busy={isPending}>
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => heading.current?.focus()}><motion.div key={step} className="auth-step-content" initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -5 }} transition={{ duration: reduceMotion ? 0 : .16 }}>
                {step === 0 ? <>
                    <div className="auth-form-row"><AuthField label="First name" name="firstName" autoComplete="given-name" required maxLength={100} placeholder="First name" value={formData.firstName} onChange={event => setFormData({ firstName: event.target.value })} /><AuthField label="Last name" name="lastName" autoComplete="family-name" required maxLength={100} placeholder="Last name" value={formData.lastName} onChange={event => setFormData({ lastName: event.target.value })} /></div>
                    <AuthField label="Work email" type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" value={formData.email} onChange={event => setFormData({ email: event.target.value })} />
                    <div className="auth-phone-row"><AuthSelect label="Country code" name="countryCode" required value={formData.countryCode} onChange={event => setFormData({ countryCode: event.target.value })}><option value="+234">Nigeria +234</option><option value="+233">Ghana +233</option><option value="+254">Kenya +254</option></AuthSelect><AuthField label="Phone number" type="tel" name="phoneNumber" autoComplete="tel-national" required maxLength={24} placeholder="080 1234 5678" value={formData.phoneNumber} onChange={event => setFormData({ phoneNumber: event.target.value })} /></div>
                </> : step === 1 ? <>
                    <AuthField label="Company or workspace name" name="companyName" autoComplete="organization" required maxLength={200} placeholder="e.g. Acme Technologies" value={formData.companyName} onChange={event => setFormData({ companyName: event.target.value })} />
                    <AuthSelect label="Industry" name="sector" required value={formData.sector} onChange={event => setFormData({ sector: event.target.value })}><option value="" disabled>Choose your industry</option>{sectors.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</AuthSelect>
                    <AuthSelect label="Your role" name="creatorRole" required value={formData.creatorRole} onChange={event => setFormData({ creatorRole: event.target.value })}><option value="" disabled>Choose your role</option>{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</AuthSelect>
                    <AuthSelect label="How did you hear about Pingstack?" name="source" required value={formData.source} onChange={event => setFormData({ source: event.target.value })}><option value="" disabled>Select an option</option>{[['Google', 'Google'], ['Linkedin', 'LinkedIn'], ['Twitter', 'X / Twitter'], ['Communication', 'Referral or word of mouth'], ['Other', 'Other']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</AuthSelect>
                </> : <>
                    <AuthPassword label="Password" name="password" autoComplete="new-password" required minLength={8} disabled={isPending} placeholder="Create a password" value={formData.password} onChange={event => setFormData({ password: event.target.value })} hint="Use at least 8 characters. Choose a password you don’t use elsewhere." />
                    <AuthPassword label="Confirm password" name="confirmPassword" autoComplete="new-password" required disabled={isPending} value={confirmation} placeholder="Enter your password again" aria-invalid={Boolean(confirmation && confirmation !== formData.password)} onChange={event => setConfirmation(event.target.value)} />
                    <div className="auth-checklist" aria-live="polite"><span className={formData.password.length >= 8 ? 'is-complete' : ''}>{formData.password.length >= 8 ? <Check size={14} /> : <i className="auth-checklist-dot" aria-hidden="true" />}8+ characters</span><span className={confirmation && confirmation === formData.password ? 'is-complete' : ''}>{confirmation && confirmation === formData.password ? <Check size={14} /> : <i className="auth-checklist-dot" aria-hidden="true" />}{confirmation && confirmation === formData.password ? 'Passwords match' : 'Passwords must match'}</span></div>
                    <dl className="auth-review"><div><dt>Your name</dt><dd>{formData.firstName} {formData.lastName}</dd></div><div><dt>Email</dt><dd>{formData.email}</dd></div><div><dt>Workspace</dt><dd>{formData.companyName}</dd></div></dl>
                </>}
            </motion.div></AnimatePresence>
            <AuthError message={error} />
            <div className="auth-step-actions">{step > 0 && <button type="button" className="auth-secondary" disabled={isPending} onClick={() => goToStep(step - 1)}><ArrowLeft size={16} />Back</button>}<AuthSubmit pending={isPending} pendingText="Creating your account…">{step === 2 ? 'Create account' : 'Continue'}</AuthSubmit></div>
        </form>
        <p className="auth-form-footnote">Already part of Pingstack? <Link to="/login" className="auth-text-link">Sign in</Link></p>
    </AuthLayout>
}
