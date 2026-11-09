import { DataSkeleton } from "../Skeleton";
import { useEffect, useRef } from 'react'
import { AlertCircle, Copy, Globe, Loader2, RefreshCw, Star, X } from '../icons'
import { StatusMark } from '../../components/messaging/EmailConfigElements'
import type { BrevoDomainDto, DnsRecordDetails } from '../../types/email/EmailConfigDto'
import { useGetSingleDomain, useMakeDomainPrimary, DOMAIN_QUERY_KEY } from '../../features/email/config/hooks/useDomain'
import { useVerifyDomain, EMAIL_CONFIG_QUERY } from '../../features/email/config/hooks/useEmailConfig'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

interface DomainDetailsModalProps {
    selectedDomain: BrevoDomainDto | null
    copiedKey: string | null
    onClose: () => void
    onSetPrimarySuccess: () => void | Promise<void>
    onCopy: (text: string, key: string) => void
}

export function DomainDetailsModal({ selectedDomain, copiedKey, onClose, onSetPrimarySuccess, onCopy }: DomainDetailsModalProps) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const dialogRef = useRef<HTMLDivElement>(null)
    const { data, isPending, isError, refetch } = useGetSingleDomain(selectedDomain?.id)
    const { mutate: makePrimary, isPending: isSettingPrimary } = useMakeDomainPrimary()
    const { mutate: verifyDomain, isPending: isVerifying } = useVerifyDomain()
    const busy = isSettingPrimary || isVerifying
    const selectedDomainId = selectedDomain?.id

    useEffect(() => {
        if (!selectedDomainId) return
        const previouslyFocused = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialogRef.current?.focus()
        return () => { document.body.style.overflow = previousOverflow; previouslyFocused?.focus() }
    }, [selectedDomainId])

    useEffect(() => {
        if (!selectedDomain) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !busy) onClose()
            if (event.key !== 'Tab') return
            const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [href], [tabindex="0"]')
            if (!controls?.length) { event.preventDefault(); return }
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus() }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [selectedDomain, busy, onClose])

    if (!selectedDomain) return null
    const domain = data ?? selectedDomain
    const records = Object.entries(data?.dns_records ?? {}) as unknown as [string, DnsRecordDetails][]

    const verify = () => {
        if (busy) return
        verifyDomain({ domainName: domain.domain_name, domainId: domain.id }, {
            onSuccess: async () => {
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: DOMAIN_QUERY_KEY }),
                    queryClient.invalidateQueries({ queryKey: [DOMAIN_QUERY_KEY, domain.id] }),
                    queryClient.invalidateQueries({ queryKey: EMAIL_CONFIG_QUERY }),
                ])
                enqueueSnackbar('DNS check complete. Your domain status has been refreshed.', { variant: 'success' })
            },
            onError: () => enqueueSnackbar('Unable to check DNS records. Please try again.', { variant: 'error' }),
        })
    }
    const setPrimary = () => {
        if (busy) return
        makePrimary(domain.id, {
            onSuccess: async () => { enqueueSnackbar('Primary sending domain updated.', { variant: 'success' }); await onSetPrimarySuccess() },
            onError: () => enqueueSnackbar('Unable to update the primary domain. Please try again.', { variant: 'error' }),
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-6" onClick={(event) => { if (event.target === event.currentTarget && !busy) onClose() }}>
            <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="domain-dialog-title" className="email-settings-card flex max-h-[90dvh] w-full max-w-3xl flex-col outline-none">
                <div className="email-section-heading shrink-0">
                    <span className="email-section-icon"><Globe size={23} /></span>
                    <div className="email-section-copy"><p className="!mt-0 !text-xs font-semibold uppercase tracking-widest text-[#004aad]">Domain setup</p><h2 id="domain-dialog-title" className="mt-1 break-all">{domain.domain_name}</h2></div>
                    <button type="button" aria-label="Close domain setup" className="email-delete-button" disabled={busy} onClick={onClose}><X size={21} /></button>
                </div>
                <div className="email-dns-dialog min-h-0 overflow-y-auto">
                    {isPending ? <DataSkeleton layout="form" rows={3} label="Loading DNS records" /> : isError || !data ? <div className="email-empty" role="alert"><AlertCircle size={26} /><h3>Couldn’t load DNS records</h3><p>Try loading this domain’s details again.</p><button type="button" className="email-button" onClick={() => void refetch()}>Try again</button></div> : <>
                        <div className={`flex items-start gap-3 rounded-xl border p-4 ${domain.verified ? 'border-emerald-100 bg-emerald-50/50' : 'border-blue-100 bg-blue-50/50'}`}>
                            <StatusMark verified={domain.verified} className="mt-1" />
                            <div><h3 className="text-base font-semibold text-slate-800">{domain.verified ? 'Your domain is verified' : 'Let’s authenticate your domain'}</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">{domain.verified ? 'Your DNS records are verified and this domain is ready for outgoing emails.' : 'Add the records below in your domain provider’s DNS settings, then check verification.'}</p></div>
                        </div>
                        <div className="mb-5 mt-7"><h3 className="text-lg font-semibold text-slate-800">DNS records</h3><p className="mt-2 text-sm leading-6 text-slate-500">Copy each host and value exactly as shown. DNS changes may take time to appear.</p></div>
                        <div className="space-y-4">
                            {records.length === 0 && <p className="email-helper">No DNS records are available yet. Try checking verification again.</p>}
                            {records.map(([key, record]) => <section key={key} className="email-dns-record">
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-3"><span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#004aad]">{record.type}</span><h4 className="break-all text-sm font-semibold text-slate-700">{record.recordName}</h4></div><span className={`email-status-label ${record.status ? '' : 'is-pending'}`}><StatusMark verified={record.status} />{record.status ? 'Verified' : 'Not verified'}</span></div>
                                <div className="space-y-4">
                                    {([{ label: 'Host name', value: record.host_name, suffix: 'host' }, { label: 'Value', value: record.value, suffix: 'value' }]).map(({ label, value, suffix }) => <div key={suffix}><p className="text-xs font-medium text-slate-500">{label}</p><div className="email-dns-value"><code>{value}</code><button type="button" aria-label={`Copy ${record.recordName} ${label.toLowerCase()}`} onClick={() => onCopy(value, `${key}-${suffix}`)}>{copiedKey === `${key}-${suffix}` ? <StatusMark /> : <Copy size={18} />}</button></div></div>)}
                                </div>
                            </section>)}
                        </div>
                    </>}
                </div>
                <div className="email-settings-footer shrink-0">
                    <p role="status">{isVerifying ? 'Checking your DNS records…' : domain.primary ? <><Star size={15} /> Primary sending domain</> : 'Authenticate your domain before sending.'}</p>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        {!domain.primary && data && <button type="button" className="email-button flex-1 sm:flex-none" onClick={setPrimary} disabled={busy || isPending || isError}>{isSettingPrimary && <Loader2 size={16} className="animate-spin" />}Make primary</button>}
                        <button type="button" className="email-button is-primary flex-1 sm:flex-none" disabled={busy || isPending || isError || !data} onClick={verify}>{isVerifying ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}Check verification</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
