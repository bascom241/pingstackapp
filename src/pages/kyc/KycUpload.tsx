import { useState, type DragEvent, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Building2, Check, FileText, ShieldCheck, UploadCloud, X, AlertCircle } from '../../ui/icons'
import './kyc.css'

type DocumentKind = 'registration' | 'supporting'
type EntityType = 'Corporate' | 'Sole proprietorship'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const documents: { key: DocumentKind; title: string; description: string; required: boolean }[] = [
    { key: 'registration', title: 'Business registration document', description: 'Your certificate of incorporation or business registration certificate.', required: true },
    { key: 'supporting', title: 'Supporting document', description: 'Add a tax document or another document that supports your business details.', required: false },
]
const formatSize = (size: number) => size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`

export default function KycVerification() {
    const [entityType, setEntityType] = useState<EntityType>('Corporate')
    const [legalName, setLegalName] = useState('')
    const [regNumber, setRegNumber] = useState('')
    const [files, setFiles] = useState<Record<DocumentKind, File | null>>({ registration: null, supporting: null })
    const [errors, setErrors] = useState<Partial<Record<DocumentKind, string>>>({})
    const [dragging, setDragging] = useState<DocumentKind | null>(null)
    const [reviewing, setReviewing] = useState(false)
    const detailsComplete = Boolean(legalName.trim() && regNumber.trim())
    const documentCount = Object.values(files).filter(Boolean).length
    const readyToReview = detailsComplete && Boolean(files.registration)
    const steps = [
        { name: 'Business details', caption: 'Tell us about your business', complete: detailsComplete },
        { name: 'Documents', caption: 'Add your registration document', complete: Boolean(files.registration) },
        { name: 'Review', caption: 'Check before submitting', complete: false },
    ]
    const currentStep = reviewing ? 2 : !detailsComplete ? 0 : 1

    const selectFile = (kind: DocumentKind, selected: FileList | File[]) => {
        const file = selected[0]
        if (!file) return
        let error = ''
        if (selected.length > 1) error = 'Choose one file for this document.'
        else if (!/\.(pdf|png|jpe?g)$/i.test(file.name) || (file.type && !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type))) error = 'Choose a PDF, PNG, or JPG file.'
        else if (file.size === 0) error = 'This file is empty. Choose another file.'
        else if (file.size > MAX_FILE_SIZE) error = 'This file is larger than 10 MB. Choose a smaller file.'
        setErrors(previous => ({ ...previous, [kind]: error }))
        if (!error) setFiles(previous => ({ ...previous, [kind]: file }))
    }
    const handleDrop = (event: DragEvent<HTMLLabelElement>, kind: DocumentKind) => {
        event.preventDefault()
        setDragging(null)
        selectFile(kind, event.dataTransfer.files)
    }
    const review = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!readyToReview) return
        setReviewing(true)
        window.requestAnimationFrame(() => document.getElementById('kyc-review-title')?.focus())
    }
    const editApplication = () => {
        setReviewing(false)
        window.requestAnimationFrame(() => document.getElementById('kyc-legal-name')?.focus())
    }

    return (
        <div className="kyc-page">
            <header className="kyc-hero">
                <div className="kyc-hero-copy">
                    <p className="kyc-eyebrow">Account setup / Business verification</p>
                    <h1>Business verification</h1>
                    <p>Add your registered business details and documents, then review your application.</p>
                </div>
            </header>

            <ol className="kyc-progress" aria-label="Verification progress">
                {steps.map((step, index) => <li key={step.name} aria-current={index === currentStep ? 'step' : undefined} className={step.complete ? 'is-complete' : ''}>
                    <span className="kyc-progress-number">{step.complete ? <Check size={18} /> : `0${index + 1}`}</span>
                    <div><strong>{step.name}</strong><p>{step.caption}</p></div>
                    {index < 2 && <span className="kyc-progress-line" aria-hidden="true" />}
                </li>)}
            </ol>

            <div className="kyc-layout">
                <div className="kyc-main">
                    {reviewing ? (
                        <section className="kyc-card">
                            <div className="kyc-section-header"><span className="kyc-section-number">03</span><div><p className="kyc-section-kicker">Application summary</p><h2 id="kyc-review-title" tabIndex={-1}>Review your application</h2><p>Make sure these details match your business documents.</p></div></div>
                            <div className="kyc-card-body">
                                <dl className="kyc-review-details"><div><dt>Business type</dt><dd>{entityType}</dd></div><div><dt>Registered business name</dt><dd>{legalName.trim()}</dd></div><div><dt>Registration number</dt><dd>{regNumber.trim()}</dd></div></dl>
                                <h3 className="kyc-review-label">Selected documents</h3>
                                <div className="kyc-review-files">{documents.map(({ key, title }) => files[key] && <div className="kyc-selected-file" key={key}><span className="kyc-file-icon"><FileText size={23} /></span><div><strong>{files[key]!.name}</strong><p>{title} · {formatSize(files[key]!.size)}</p></div><span className="kyc-file-badge">Selected</span></div>)}</div>
                                <div className="kyc-submission-note" role="status"><AlertCircle size={20} /><p>Online submission is not available yet. Your documents have not been sent, and selected files will be cleared when you leave or refresh this page.</p></div>
                            </div>
                            <div className="kyc-form-footer"><button type="button" className="kyc-secondary" onClick={editApplication}><ArrowLeft size={18} /> Edit application</button><button type="button" className="kyc-primary" disabled>Submit for verification</button></div>
                        </section>
                    ) : (
                        <form onSubmit={review}>
                            <section className="kyc-card" aria-labelledby="business-details-title">
                                <div className="kyc-section-header"><span className="kyc-section-number">01</span><div><p className="kyc-section-kicker">Business information</p><h2 id="business-details-title">Your business details</h2><p>Use the information on your official registration document.</p></div></div>
                                <div className="kyc-card-body">
                                    <fieldset className="kyc-entity-field"><legend>Business type</legend><div className="kyc-entity-options">{(['Corporate', 'Sole proprietorship'] as const).map(type => <label key={type} className={`kyc-entity-option ${entityType === type ? 'is-selected' : ''}`}><input type="radio" name="entityType" value={type} checked={entityType === type} onChange={() => setEntityType(type)} /><Building2 size={21} /><span>{type}</span><span className="kyc-radio-mark" aria-hidden="true" /></label>)}</div></fieldset>
                                    <div className="kyc-field"><label htmlFor="kyc-legal-name">Registered business name <span>*</span></label><input id="kyc-legal-name" name="legalName" autoComplete="organization" required maxLength={200} placeholder="e.g. Acme Technologies Ltd" value={legalName} onChange={event => setLegalName(event.target.value)} aria-describedby="kyc-name-hint" /><p id="kyc-name-hint">Enter the full legal name, including any registered suffix.</p></div>
                                    <div className="kyc-field"><label htmlFor="kyc-registration">Business registration number <span>*</span></label><input id="kyc-registration" name="registrationNumber" required maxLength={100} placeholder="Enter your registration number" value={regNumber} onChange={event => setRegNumber(event.target.value)} /></div>
                                </div>
                            </section>

                            <section className="kyc-card" aria-labelledby="kyc-documents-title">
                                <div className="kyc-section-header"><span className="kyc-section-number">02</span><div><p className="kyc-section-kicker">Supporting files</p><h2 id="kyc-documents-title">Business documents</h2><p>Choose clear, complete copies with all text and edges visible.</p></div><span className="kyc-document-count">{documentCount} selected</span></div>
                                <div className="kyc-card-body kyc-document-list">
                                    {documents.map(({ key, title, description, required }) => <div className="kyc-document" key={key}>
                                        <div className="kyc-document-heading"><h3>{title}</h3><span>{required ? 'Required' : 'Optional'}</span></div><p className="kyc-document-description">{description}</p>
                                        {files[key] ? <div className="kyc-selected-file"><span className="kyc-file-icon"><FileText size={23} /></span><div><strong>{files[key]!.name}</strong><p>{formatSize(files[key]!.size)} · Selected for review</p></div><button type="button" onClick={() => { setFiles(previous => ({ ...previous, [key]: null })); setErrors(previous => ({ ...previous, [key]: '' })) }} aria-label={`Remove ${files[key]!.name}`}><X size={18} /></button></div> : <label className={`kyc-dropzone ${dragging === key ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(key) }} onDragLeave={() => setDragging(null)} onDrop={event => handleDrop(event, key)}>
                                            <input type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" aria-label={`Choose ${title.toLowerCase()}`} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `kyc-${key}-error` : undefined} onChange={event => { if (event.target.files) selectFile(key, event.target.files); event.target.value = '' }} />
                                            <span className="kyc-upload-icon"><UploadCloud size={25} /></span><span className="kyc-dropzone-copy"><strong><span>Choose a file</span> or drag it here</strong><small>PDF, PNG or JPG · Up to 10 MB</small></span><span className="kyc-browse" aria-hidden="true">Browse files <ArrowRight size={16} /></span>
                                        </label>}
                                        {errors[key] && <p id={`kyc-${key}-error`} className="kyc-file-error" role="alert">{errors[key]}</p>}
                                    </div>)}
                                    <p className="kyc-local-note">Files stay in this session until you leave or refresh. Review your application before submitting.</p>
                                </div>
                            </section>
                            <div className="kyc-form-footer kyc-main-footer"><p>Next: check your details and documents.</p><button type="submit" className="kyc-primary" disabled={!readyToReview}>Review application <ArrowRight size={18} /></button></div>
                        </form>
                    )}
                </div>

                <aside className="kyc-sidebar" aria-label="Verification guidance">
                    <section className="kyc-guide"><span className="kyc-guide-icon"><ShieldCheck size={27} /></span><p className="kyc-section-kicker">Document checklist</p><h2>Before you upload</h2><p className="kyc-guide-intro">A complete application starts with consistent details and readable documents.</p><ul>{['Match your business name to your registration document.', 'Include every page and keep all four corners visible.', 'Use clear originals without edits or cropped text.'].map(item => <li key={item}><span><Check size={15} /></span>{item}</li>)}</ul></section>
                    <section className="kyc-summary"><h2>Your application</h2><div><span>Business details</span><strong className={detailsComplete ? 'is-ready' : ''}>{detailsComplete ? 'Complete' : 'To do'}</strong></div><div><span>Registration document</span><strong className={files.registration ? 'is-ready' : ''}>{files.registration ? 'Selected' : 'To do'}</strong></div><div><span>Supporting document</span><strong>{files.supporting ? 'Selected' : 'Optional'}</strong></div><p>{reviewing ? 'Your application is ready to review. It has not been submitted.' : 'Complete the required details and add your registration document to review your application.'}</p></section>
                </aside>
            </div>
        </div>
    )
}
