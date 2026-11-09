import type { CSSProperties } from 'react'
import './skeleton.css'

type SkeletonProps = { width?: CSSProperties['width']; height?: CSSProperties['height']; className?: string; style?: CSSProperties }
export function Skeleton({ width = '100%', height = 16, className = '', style }: SkeletonProps) {
    return <span aria-hidden="true" className={`app-skeleton ${className}`} style={{ width, height, ...style }} />
}
export function InlineSkeleton({ width = 110, height = 20, label = 'Loading data' }: SkeletonProps & { label?: string }) {
    return <span className="app-skeleton-inline" role="status" aria-busy="true" style={{ width }}><span className="sr-only">{label}</span><Skeleton width="100%" height={height} /></span>
}

type Layout = 'list' | 'table' | 'cards' | 'form' | 'chart' | 'detail' | 'editor'
export function DataSkeleton({ layout = 'list', rows = 4, label = 'Loading data', className = '' }: { layout?: Layout; rows?: number; label?: string; className?: string }) {
    const body = layout === 'chart' ? <div className="app-skeleton-chart"><div className="app-skeleton-chart-axis">{[1, 2, 3, 4].map(n => <Skeleton key={n} width={24} height={12} />)}</div><div className="app-skeleton-chart-bars">{[38, 65, 47, 80, 58, 92, 68, 78].map((height, n) => <Skeleton key={n} height={`${height}%`} />)}</div></div>
        : layout === 'cards' ? <div className="app-skeleton-cards">{Array.from({ length: rows }, (_, n) => <div key={n} className="app-skeleton-card"><Skeleton height={120} /><Skeleton width="68%" height={22} /><Skeleton /><Skeleton width="80%" /><Skeleton height={38} /></div>)}</div>
        : layout === 'table' ? <div className="app-skeleton-table"><div className="app-skeleton-table-row app-skeleton-table-head">{[1, 2, 3].map(n => <Skeleton key={n} width="65%" height={12} />)}</div>{Array.from({ length: rows }, (_, n) => <div key={n} className="app-skeleton-table-row"><Skeleton width="85%" /><Skeleton width="65%" /><Skeleton width="75%" /></div>)}</div>
        : layout === 'form' ? <div className="app-skeleton-form">{Array.from({ length: rows }, (_, n) => <div key={n}><Skeleton width={n % 2 ? '32%' : '45%'} height={13} /><Skeleton height={48} /></div>)}</div>
        : layout === 'detail' || layout === 'editor' ? <div className="app-skeleton-detail"><div className="app-skeleton-detail-top"><Skeleton width="40%" height={26} /><Skeleton width={110} height={38} /></div><div className="app-skeleton-detail-grid"><div className="app-skeleton-detail-side"><Skeleton width="65%" height={20} /><DataSkeleton layout="form" rows={3} label="Loading fields" /></div><Skeleton height={layout === 'editor' ? 480 : 380} /></div></div>
        : <div className="app-skeleton-list">{Array.from({ length: rows }, (_, n) => <div key={n} className="app-skeleton-list-row"><Skeleton width={42} height={42} /><div><Skeleton width={n % 2 ? '62%' : '78%'} /><Skeleton width="45%" height={12} /></div><Skeleton width={54} height={23} /></div>)}</div>
    return <div className={`app-data-skeleton ${className}`} role="status" aria-busy="true"><span className="sr-only">{label}</span><div aria-hidden="true">{body}</div></div>
}
export function PageSkeleton({ layout = 'table', label = 'Loading page' }: { layout?: Layout; label?: string }) {
    return <div className="app-page-skeleton"><div className="app-page-skeleton-heading" aria-hidden="true"><Skeleton width="35%" height={32} /><Skeleton width="60%" height={16} /></div><DataSkeleton layout={layout} label={label} /></div>
}
