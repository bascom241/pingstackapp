import { create } from 'zustand'
import type { RegisterType } from '../../../types/auth/auth'

const emptyForm: RegisterType = { firstName: '', lastName: '', email: '', password: '', phoneNumber: '', companyName: '', sector: '', creatorRole: '', source: '', countryCode: '+234' }
type RegisterStore = { formData: RegisterType; setFormData: (data: Partial<RegisterType>) => void; resetForm: () => void }
export const useRegisterStore = create<RegisterStore>(set => ({
    formData: { ...emptyForm },
    setFormData: data => set(state => ({ formData: { ...state.formData, ...data } })),
    resetForm: () => set({ formData: { ...emptyForm } }),
}))
