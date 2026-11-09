import type { RegisterType } from '../../types/auth/auth'

export function safeAuthRedirect(value: string | null): string {
    if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard'
    try {
        const url = new URL(value, 'https://pingstack.invalid')
        if (url.origin !== 'https://pingstack.invalid' || !(url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/'))) return '/dashboard'
        return url.pathname + url.search + url.hash
    } catch { return '/dashboard' }
}
export function normalizeRegistrationPhone(countryCode: string, phone: string): string {
    const clean = phone.replace(/[\s().-]/g, '')
    return clean.startsWith('+') ? clean : countryCode + clean.replace(/^0+/, '')
}
export function registrationPayload(form: RegisterType): RegisterType {
    return { ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), companyName: form.companyName.trim(), phoneNumber: normalizeRegistrationPhone(form.countryCode, form.phoneNumber) }
}
