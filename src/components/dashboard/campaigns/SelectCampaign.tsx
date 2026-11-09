import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Mail, MessageSquare, PhoneCall, X } from '../../../ui/icons'
import { useCreateCampaignStore } from '../../../features/campaigns/store/createCampaignStore'

interface SelectCampaignProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function SelectCampaign({ isOpen, setIsOpen }: SelectCampaignProps) {
    const [selected, setSelected] = useState('email')
    const navigate = useNavigate()
    const dialogRef = useRef<HTMLDivElement>(null)
    const { setSelectedCampaignType, setCurrentStep } = useCreateCampaignStore()

    useEffect(() => {
        if (!isOpen) return
        const previousFocus = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialogRef.current?.focus()
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
            if (event.key !== 'Tab') return
            const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')
            if (!controls?.length) return
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
            previousFocus?.focus()
        }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    const channels = [
        { id: 'email', name: 'Email', icon: Mail, description: 'Bring your story to life with newsletters and beautifully designed emails.', available: true },
        { id: 'sms', name: 'SMS', icon: PhoneCall, description: 'Keep it direct with timely updates delivered to your audience’s phones.', available: false },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, description: 'Keep the conversation going with your customers on WhatsApp.', available: false },
    ]

    const continueToCampaign = () => {
        if (selected !== 'email') return
        setSelectedCampaignType('email')
        setCurrentStep(1)
        setIsOpen(false)
        navigate('/dashboard/campaigns/create')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm" onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="campaign-channel-title" aria-describedby="campaign-channel-description" tabIndex={-1} className="my-auto max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl outline-none sm:p-9">
                <div className="flex items-start justify-between gap-5">
                    <div>
                        <p className="messaging-eyebrow">Start a conversation</p>
                        <h2 id="campaign-channel-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Choose your channel</h2>
                        <p id="campaign-channel-description" className="mt-3 text-base leading-7 text-slate-500">How would you like to reach your audience?</p>
                    </div>
                    <button type="button" onClick={() => setIsOpen(false)} aria-label="Close channel selector" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><X size={20} /></button>
                </div>
                <div className="my-8 space-y-3">
                    {channels.map(({ id, name, icon: Icon, description, available }) => (
                        <button key={id} type="button" disabled={!available} aria-pressed={selected === id} onClick={() => setSelected(id)} className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${selected === id ? 'border-[#004aad] bg-blue-50/50' : 'border-slate-200 bg-slate-50'} disabled:cursor-not-allowed`}>
                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${available ? 'bg-blue-100 text-[#004aad]' : 'bg-slate-200/60 text-slate-500'}`}><Icon size={23} /></span>
                            <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-3 text-lg font-semibold text-slate-900">{name}{!available && <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-medium text-slate-600">Coming soon</span>}</span><span className="mt-1.5 block text-sm leading-6 text-slate-500">{description}</span></span>
                            {selected === id && <CheckCircle2 size={22} className="mt-1 shrink-0 text-[#004aad]" />}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end border-t border-slate-100 pt-6"><button type="button" onClick={continueToCampaign} className="messaging-primary w-full sm:w-auto">Continue with email <ArrowRight size={18} /></button></div>
            </div>
        </div>
    )
}
