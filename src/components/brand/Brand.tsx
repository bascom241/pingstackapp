import logo from '../../assets/Logo.png'
import './brand.css'

type BrandProps = {
    stacked?: boolean
    light?: boolean
    size?: number
    className?: string
}

export default function Brand({ stacked = false, light = false, size = 44, className = '' }: BrandProps) {
    return <span className={`app-brand ${stacked ? 'app-brand-stacked' : ''} ${light ? 'app-brand-light' : ''} ${className}`}>
        <img src={logo} alt="" width={size} height={size} className="app-brand-logo" style={{ width: size, height: size }} decoding="async" />
        <span className="app-brand-name">Pingstack</span>
    </span>
}
