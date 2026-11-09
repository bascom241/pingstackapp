import { ArrowRight, Mail } from '../../../ui/icons'

interface EmptyCartonStateProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function EmptyCartonState({ setIsOpen }: EmptyCartonStateProps) {
    return (
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center sm:py-20">
            <span className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 text-[#004aad]"><Mail size={34} /></span>
            <p className="messaging-eyebrow">Your next connection starts here</p>
            <h2 className="max-w-lg text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Make your first campaign count.</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-500">Share an announcement, introduce something new, or simply say hello. Your audience is waiting to hear from you.</p>
            <button type="button" onClick={() => setIsOpen(true)} className="messaging-primary mt-8">Create your first campaign <ArrowRight size={18} /></button>
        </section>
    )
}
