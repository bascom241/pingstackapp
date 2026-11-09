import { create } from 'zustand'

export type InterfaceSettings = { sidebarCollapsed: boolean; reduceMotion: boolean; showBalance: boolean }
export const defaultInterfaceSettings: InterfaceSettings = { sidebarCollapsed: false, reduceMotion: false, showBalance: true }
const STORAGE_KEY = 'pingstack:interface-settings:v1'
function readSettings(): InterfaceSettings {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        return Object.fromEntries(Object.entries(defaultInterfaceSettings).map(([key, fallback]) => [key, typeof value?.[key] === 'boolean' ? value[key] : fallback])) as InterfaceSettings
    } catch { return { ...defaultInterfaceSettings } }
}
function save(settings: InterfaceSettings) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); return true } catch { return false }
}
export const useInterfaceSettings = create<InterfaceSettings & {
    update: (values: Partial<InterfaceSettings>) => boolean
    reset: () => boolean
    toggleSidebar: () => boolean
}>((set, get) => ({
    ...readSettings(),
    update: values => {
        const current = get()
        const next = { sidebarCollapsed: current.sidebarCollapsed, reduceMotion: current.reduceMotion, showBalance: current.showBalance, ...values }
        set(next)
        return save(next)
    },
    reset: () => { set(defaultInterfaceSettings); return save(defaultInterfaceSettings) },
    toggleSidebar: () => get().update({ sidebarCollapsed: !get().sidebarCollapsed }),
}))
