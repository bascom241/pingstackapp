import { useId, useState, type ComponentType, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { safeAuthRedirect } from '../../features/auth/utils'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Mail, MessageSquare, Code2, User, PhoneCall, Building2, Globe, KeyRound, AlertCircle, type IconProps } from '../../ui/icons'
import Brand from '../brand/Brand'
import './auth.css'

const fieldIcons: Record<string, ComponentType<IconProps>> = {
    firstName: User, lastName: User, email: Mail, phoneNumber: PhoneCall,
    companyName: Building2, countryCode: Globe, sector: Building2, creatorRole: User,
    source: Globe, token: KeyRound,
}

type AuthVariant = 'login' | 'register' | 'recovery'
export function AuthLayout({ children, variant = 'login' }: { children: ReactNode; variant?: AuthVariant }) {
    const [params] = useSearchParams()
    const redirectSuffix = params.get('redirect') ? `?redirect=${encodeURIComponent(safeAuthRedirect(params.get('redirect')))}` : ''
    return <main className="auth-shell">
        <aside className="auth-aside">
            <Link to={`/login${redirectSuffix}`} className="auth-brand-link" aria-label="Pingstack sign in"><Brand size={48} /></Link>
            <div className="auth-aside-content"><p className="auth-eyebrow">Your messaging workspace</p><h2>Stay close to<br />your customers.</h2><p>One place to manage the messages that keep your business connected.</p><div className="auth-capabilities">{[
                { icon: MessageSquare, title: 'SMS that keeps people informed', text: 'Updates, reminders, and everyday conversations.' },
                { icon: Mail, title: 'Email with your identity', text: 'Your domains, your templates, your audience.' },
                { icon: Code2, title: 'Tools for your application', text: 'Bring messaging into the workflows you build.' },
            ].map(({ icon: Icon, title, text }) => <div key={title}><span><Icon size={21} /></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></div>
            <p className="auth-aside-footer">A little more connected. With Pingstack.</p>
        </aside>
        <section className="auth-main">
            <header className="auth-topbar"><Link to={`/login${redirectSuffix}`} className="auth-mobile-brand" aria-label="Pingstack sign in"><Brand size={40} /></Link><p>{variant === 'register' ? <>Already have an account? <Link to={`/login${redirectSuffix}`}>Sign in <ArrowRight size={14} /></Link></> : variant === 'login' ? <>New to Pingstack? <Link to={`/register${redirectSuffix}`}>Create an account <ArrowRight size={14} /></Link></> : <Link to={`/login${redirectSuffix}`}><ArrowLeft size={15} /> Back to sign in</Link>}</p></header>
            <div className="auth-body"><div className={`auth-form-wrap ${variant === 'register' ? 'auth-form-wide' : ''}`}>{children}</div></div>
            <footer className="auth-footer">Pingstack · Your business, connected.</footer>
        </section>
    </main>
}
export function AuthHeading({ eyebrow, title, description, icon }: { eyebrow: string; title: string; description: string; icon?: ReactNode }) {
    return <div className="auth-heading">{icon && <span className="auth-heading-icon" aria-hidden="true">{icon}</span>}<p className="auth-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
}
export function AuthField({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
    const generatedId = useId()
    const id = props.id || generatedId
    const Icon = fieldIcons[props.name || ''] || (props.type === 'email' ? Mail : User)
    return <div className="auth-field"><label htmlFor={id}>{label}</label><div className="auth-input-icon"><span className="auth-field-icon" aria-hidden="true"><Icon size={18} /></span><input {...props} id={id} aria-describedby={hint ? `${id}-hint` : props['aria-describedby']} /></div>{hint && <p id={`${id}-hint`}>{hint}</p>}</div>
}
export function AuthPassword({ label, hint, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string; hint?: string }) {
    const [visible, setVisible] = useState(false)
    const generatedId = useId()
    const id = props.id || generatedId
    return <div className="auth-field"><label htmlFor={id}>{label}</label><div className="auth-password auth-input-icon"><span className="auth-field-icon" aria-hidden="true"><KeyRound size={18} /></span><input {...props} id={id} type={visible ? 'text' : 'password'} aria-describedby={hint ? `${id}-hint` : props['aria-describedby']} /><button type="button" disabled={props.disabled} onClick={() => setVisible(previous => !previous)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>{hint && <p id={`${id}-hint`}>{hint}</p>}</div>
}
export function AuthSelect({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
    const generatedId = useId()
    const id = props.id || generatedId
    const Icon = fieldIcons[props.name || ''] || Globe
    return <div className="auth-field"><label className="auth-select-label" htmlFor={id}><Icon size={15} />{label}</label><select {...props} id={id}>{children}</select></div>
}
export function AuthSubmit({ children, pending, pendingText, disabled = false }: { children: ReactNode; pending?: boolean; pendingText?: string; disabled?: boolean }) {
    return <button type="submit" className="auth-primary" disabled={pending || disabled}>{pending ? <><Loader2 size={18} className="animate-spin" />{pendingText || 'Please wait…'}</> : <>{children}<ArrowRight size={18} /></>}</button>
}
export function AuthError({ message }: { message: string }) { return message ? <p className="auth-error" role="alert"><AlertCircle size={18} /><span>{message}</span></p> : null }
