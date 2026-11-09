import type { ReactNode } from 'react'
import './email-configuration.css'

export function StatusMark({ verified = true, className = '' }: { verified?: boolean; className?: string }) {
    return <span className={`email-status-mark ${verified ? 'is-verified' : 'is-pending'} ${className}`} aria-hidden="true">
        {verified ? <svg viewBox="0 0 20 20" fill="none"><path d="m5.5 10 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span />}
    </span>
}

export function EmailSectionHeading({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
    return <div className="email-section-heading">
        <span className="email-section-icon">{icon}</span>
        <div className="email-section-copy"><h2>{title}</h2><p>{description}</p></div>
        {action && <div className="email-section-action">{action}</div>}
    </div>
}
