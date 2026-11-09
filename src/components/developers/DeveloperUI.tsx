import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Check, Copy, ArrowUpRight } from '../../ui/icons'
import './developers.css'

export function DeveloperPage({ title, description, children, action }: { title: string; description: string; children: ReactNode; action?: ReactNode }) {
    return <div className="dev-page">
        <header className="dev-page-header"><div><p className="dev-eyebrow">Workspace / Developers</p><h1>{title}</h1><p className="dev-page-description">{description}</p></div>{action}</header>
        <nav className="dev-navigation" aria-label="Developer tools">
            <NavLink to="/dashboard/api-keys">API keys & sandbox</NavLink>
            <NavLink to="/dashboard/webhooks">Webhooks</NavLink>
            <NavLink to="/dashboard/otp-guide">OTP guide</NavLink>
        </nav>
        {children}
    </div>
}

export function DeveloperCard({ title, description, children, action, id }: { title: string; description?: string; children: ReactNode; action?: ReactNode; id?: string }) {
    return <section className="dev-card" id={id}><div className="dev-card-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</section>
}

export function CodeBlock({ code, title = 'Example', action }: { code: string; title?: string; action?: ReactNode }) {
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
    useEffect(() => { setCopied(false); setError('') }, [code])
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setError('')
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => setCopied(false), 2000)
        } catch { setError('Could not copy. Select the code and copy it manually.') }
    }
    return <div className="dev-code"><div className="dev-code-toolbar"><span>{title}</span><div>{action}<button type="button" onClick={() => void copy()} aria-label={`Copy ${title.toLowerCase()}`}><span aria-hidden="true">{copied ? <Check size={16} /> : <Copy size={16} />}</span>{copied ? 'Copied' : 'Copy'}</button></div></div><pre><code>{code}</code></pre><span className="sr-only" role="status">{copied ? 'Code copied.' : ''}</span>{error && <p className="dev-copy-error" role="alert">{error}</p>}</div>
}

export function DeveloperNote({ title, children }: { title: string; children: ReactNode }) {
    return <section className="dev-note"><h3>{title}</h3><div>{children}</div></section>
}

export function DeveloperLink({ to, children }: { to: string; children: ReactNode }) {
    return <NavLink className="dev-text-link" to={to}>{children}<ArrowUpRight size={15} /></NavLink>
}
