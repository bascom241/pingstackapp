import type { ReactNode } from 'react'
import './messaging.css'

type MessagingHeaderProps = {
    eyebrow?: string
    title: string
    description: string
    action?: ReactNode
}

export default function MessagingHeader({ eyebrow = 'Messaging workspace', title, description, action }: MessagingHeaderProps) {
    return (
        <header className="messaging-header">
            <div className="messaging-header-copy">
                <p className="messaging-eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p className="messaging-description">{description}</p>
            </div>
            {action && <div className="messaging-header-action">{action}</div>}
        </header>
    )
}
